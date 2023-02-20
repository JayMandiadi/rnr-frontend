import { lazy } from "react"
import { useRouteMatch, Redirect } from "react-router-dom"
import { renderRoutes } from "Routing"

const AssetDashboard = lazy(() => import("Features/AssetManagement/Pages/AssetDashboard"))

export default function AssetManagementRoute() {
  const match = useRouteMatch()
  const baseRoute = match.url

  const routes = [
    {
      component: AssetDashboard,
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
