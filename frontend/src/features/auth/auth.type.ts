export type Role = "admin" | "viewer"

export type AuthUser = {
  id: number
  username: string
  role: Role
}

export type LoginResult = {
  token: string
  user: AuthUser
}
