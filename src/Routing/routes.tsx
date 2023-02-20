import { useHistory, Redirect } from "react-router-dom"
import React, { lazy, useEffect } from "react"

import map from "lodash/map"
import omit from "lodash/omit"

const LoginPage = lazy(() => import("Features/Auth"))
const AssetsPage = lazy(() => import("Features/AssetManagement"))

const ROUTES = [
  {
    key: "home",
    component: AssetsPage,
    path: "/",
    exact: true,
    pageProps: {
      isRouteProtected: true,
      pageTitle: "Home",
    },
  },
  {
    key: "login-page",
    component: LoginPage,
    path: "/login",
    exact: true,
    pageProps: {
      isRouteProtected: false,
      pageTitle: "Login",
    },
  },
  {
    key: "not-found-app-level",
    component: NotFound,
    path: "/not-found",
    pageProps: {
      isRouteProtected: false,
      pageTitle: "Page Not Found",
    },
  },
  {
    key: "not-found-redirect",
    component: () => <Redirect to="/not-found" />,
    path: "*",
  },
]

export default ROUTES

export const routes = map(ROUTES, (route: any) => omit(route, ["component"]))

function NotFound() {
  return <>Page not found</>
}
