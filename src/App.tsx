import React from "react"
import { BrowserRouter } from "react-router-dom"
import { configure } from "axios-hooks"

import { authAxios } from "Utils"
import { renderRoutes, routes } from "Routing"

import "./App.css"

// set axios hooks configuration
configure({
  axios: authAxios,
  defaultOptions: {
    useCache: false,
  },
})

function App() {
  return <BrowserRouter>{renderRoutes(true, routes)}</BrowserRouter>
}

export default App
