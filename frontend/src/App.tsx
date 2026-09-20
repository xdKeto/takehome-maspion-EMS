
import AppProviders from "@/app/providers"
import AppRoutes from "@/app/router"

const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App
