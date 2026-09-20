import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/AuthContext"
import UserCreateDialog from "@/features/users/UserCreateDialog"
import { useState } from "react"

const Topbar = () => {
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header className="border-b border-border/70 bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
        <Link to="/employees" className="mr-auto font-heading text-sm font-bold uppercase tracking-[0.18em] text-foreground">
          EMS
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link className="px-3 py-2 text-muted-foreground hover:text-foreground" to="/employees">Employees</Link>
          <Link className="px-3 py-2 text-muted-foreground hover:text-foreground" to="/api-documentation">API Docs</Link>
        </nav>
        <div className="flex items-center gap-3 border-l border-border/70 pl-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{user?.username} · {user?.role}</span>
          {isAdmin && (
            <Button type="button" variant="outline" size="sm" onClick={() => setUserDialogOpen(true)}>
              Tambah User
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <UserCreateDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        onCreated={() => {
          setNotice("User created")
          window.setTimeout(() => setNotice(null), 3000)
        }}
      />
      {notice && <p className="border-t border-border/70 bg-muted px-4 py-2 text-center text-sm text-muted-foreground">{notice}</p>}
    </header>
  )
}

export default Topbar
