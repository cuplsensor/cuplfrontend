import React from "react";
import {Header, Footer, Section} from "./BasePage"
import {Link} from "react-router-dom";

export function ConsumerBasePage(props) {
  return (
    <div>
      <ConsumerHeader />
        <Section>
            {props.children}
        </Section>
      <Footer />
    </div>
  );
}

function ConsumerHeader() {
    return (
        <Header>
            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-end">
                  <div className="navbar-item">
                    <Link to="/random">Random</Link>
                  </div>
                  <div className="navbar-item">
                    <div className="buttons">
                      <Link className="button" to="/admin/tags">Admin</Link>
                    </div>
                  </div>
                </div>
            </div>
        </Header>
    );
}