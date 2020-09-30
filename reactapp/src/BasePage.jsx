import {Link} from "react-router-dom";
import React from "react";

function BasePage(props) {
  return (
    <div>
      <Header />
        {props.children}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
  <div className="footer pt-3 pb-4">
    <div className="container">
      <nav className="level">
        <div className="level-left">
          <div className="level-item mr-1">
            <a href="https://github.com/cuplsensor/wsfrontend">cuplfrontend</a>
          </div>
          <div className="level-item">
            by Plotsensor Ltd.
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <a href="https://github.com/cuplsensor/wsfrontend/blob/master/LICENSE">Licence</a>
          </div>
          <div className="level-item">
            <a href="/version">Version</a>
          </div>
          <div className="level-item">
            <a href="https://wsfrontend.readthedocs.io/en/latest/index.html#index">Docs</a>
          </div>
        </div>

      </nav>
    </div>
  </div>
  );
}

function Header() {
  return <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="container">
      <div className="navbar-brand">

        <a className="navbar-item" href="/"><h4>plotsensor</h4></a>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false"
           data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>

      </div>

      <div id="navbarBasicExample" className="navbar-menu">

        <div className="navbar-end">
          <div className="navbar-item">
            <Link to="/random">Random</Link>
          </div>
          <div className="navbar-item">
            <div className="buttons">
              <Link className="button" to="/admin">Admin</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </nav>
}

export default BasePage;