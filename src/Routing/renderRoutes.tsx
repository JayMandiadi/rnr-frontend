import React, { Suspense } from "react"
import { RouteComponentProps, SwitchProps } from "react-router"
import { Route, Switch } from "react-router-dom"

import PageLayout from "Routing/Layout"

export interface RouteConfigComponentProps<Params extends { [K in keyof Params]?: string } = {}>
  extends RouteComponentProps<Params> {
  route?: RouteConfig
}

export interface RouteConfig {
  key?: React.Key
  component?: React.FC<any>
  path?: string | string[]
  exact?: boolean
  strict?: boolean
  routes?: RouteConfig[]
  render?: (props: RouteConfigComponentProps<any>) => React.ReactNode
  [propName: string]: any
}

export default function renderRoutes(
  isMain = false,
  routes: RouteConfig[] | undefined,
  extraProps: { [propName: string]: any } = {},
  switchProps: SwitchProps = {}
): JSX.Element | null {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route: any, i: any) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props) => {
            const { pageProps = {}, key } = route
            const children = (
              <Suspense
                fallback={
                  <div style={{ position: "absolute", top: "30%", left: "50%" }}>Loading...</div>
                }
              >
                <route.component {...props} {...extraProps} route={route} />
              </Suspense>
            )

            if (!isMain) return children
            return (
              <PageLayout
                className="flex-1"
                {...{
                  ...props,
                  ...pageProps,
                }}
                key={route.key || i}
                logo={extraProps?.logo}
              >
                {children}
              </PageLayout>
            )
          }}
        />
      ))}
    </Switch>
  ) : null
}
