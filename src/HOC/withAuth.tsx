import React from "react"
import { Redirect } from "react-router-dom"
import { isTokenValid } from "Utils"

const withAuth = (WrappedComponent: any) => {
  function Auth(props: any) {
    const path = props?.location?.pathname
    const accessToken = localStorage.getItem("accessToken")
    const validToken = isTokenValid(accessToken ?? "")
    const notAllowedRoutes = ["/login"]

    // Render not found route
    if (props?.isRouteProtected === undefined) return <Redirect to="/not-found" />

    // Redirect to home page if logged in user access public routes
    if (!props?.isRouteProtected && validToken && notAllowedRoutes?.includes(path)) {
      return <Redirect to="/" />
    }

    // Redirect to login page if non logged in user access protected routes
    if (props?.isRouteProtected && !validToken) {
      const redirect = `/login`
      return <Redirect to={redirect} />
    }

    return <WrappedComponent {...props} />
  }

  return Auth
}

export default withAuth
