import { Outlet } from "react-router-dom"
import Topbar from "./Topbar"

const AppLayout = () => {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Topbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
