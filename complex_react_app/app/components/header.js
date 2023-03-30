import React, { useState, useContext } from "react"
import HeaderLogin from "./headerLogin"
import HeaderLogout from "./headerLogout"
import StateContext from "../StateContext"

function Header(props) {
  const appState = useContext(StateContext)
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <a href="/" className="text-white">
            ComplexApp
          </a>
        </h4>
        {appState.logged ? <HeaderLogin /> : <HeaderLogout />}
      </div>
    </header>
  )
}

export default Header
