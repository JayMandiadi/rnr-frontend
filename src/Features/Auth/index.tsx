import { lazy } from "react"
import { useRouteMatch, Redirect } from "react-router-dom"
import { renderRoutes } from "Routing"

const Login = lazy(() => import("Features/Auth/Pages/LoginPage"))

export default function AuthRoute() {
  const match = useRouteMatch()
  const baseRoute = match.url

  const routes = [
    {
      component: Login,
      path: baseRoute,
      exact: true,
    },
    {
      key: "redirect",
      component: () => <Redirect to="/not-found" />,
      path: "*",
    },
  ]

  return renderRoutes(false, routes, { baseRoute })
}
