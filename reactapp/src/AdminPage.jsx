import LoginForm from "./LoginForm";
import {Footer, Header, Section} from "./BasePage";
import React from "react";
import {Link, Redirect, useLocation} from "react-router-dom";

export function AdminLogin() {
    return (
        <AdminBasePage bc={<AdminLoginBC />} isLoggedIn={false}>
            <LoginForm />
        </AdminBasePage>
    );
}

function AdminBasePage(props) {
    const isLoggedIn = props.isLoggedIn;
    const bc = props.bc;
  return (
    <div>
      <AdminHeader bc={bc} isLoggedIn={isLoggedIn} />
          <Section>
              {props.children}
          </Section>
      <Footer />
    </div>
  );
}

function AdminHeader(props) {
    const isLoggedIn = props.isLoggedIn;
    return (
        <Header bc={props.bc}>
            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-start ">

                </div>
                <div className="navbar-end">
                  <div className="navbar-item">
                      <Link className="button" to="/">Consumer</Link>
                  </div>
                    <AdminLogOutButton isLoggedIn={isLoggedIn} />
                </div>
            </div>
        </Header>
    );
}

function AdminLogOutButton(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return(
            <div className="navbar-item">
                <Link className="button" to="/admin/login">Log Out</Link>
            </div>
            );
    } else {
        return('');
    }
}

export function RedirectToLogin(props) {
    const location = useLocation();
    const error = props.error;
    if (error) {
          if (error.message === "UNAUTHORIZED") {
              return (
                  <Redirect to={{
                    pathname: `/admin/login`,
                    state: {referrer: location, error: error}}} />
                  );
          }
        }
    return ('');
}

export function AdminPage(props) {
        return(
            <AdminBasePage bc={props.bc} isLoggedIn={true}>
                <div className="columns">
                    <aside className="menu column is-2 is-fullheight">
                        {props.menu}
                    </aside>
                    <div className="column is-10">
                        {props.children}
                    </div>
                </div>
            </AdminBasePage>
        );
}

function AdminLoginBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href="#">Log In</a></li>
        </ul>
      </nav>
    );
}


export function AdminBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href="#">Admin</a></li>
            {props.children}
        </ul>
      </nav>
    );
}

export function AdminMenu(props) {
    return (
        <div>
            <ul className="menu-list">
                <MenuListElement name="Tags" url="/admin/tags" active={props.activetab} />
                <MenuListElement name="Captures" url="/admin/captures" active={props.activetab} />
                <MenuListElement name="Webhooks" url="/admin/webhooks" active={props.activetab} />
            </ul>
        </div>
    );
}

export function MenuListElement(props) {
    if (props.name.toLowerCase() === props.active.toLowerCase()) {
        return (
          <li>
              <a className="is-active" href={props.url}>{props.name}</a>
          </li>
        );
    } else {
        return (
            <li>
                <a href={props.url}>{props.name}</a>
            </li>
        );
    }
}

export function ListElement(props) {
    if (props.name.toLowerCase() === props.active.toLowerCase()) {
        return (
          <li className="is-active">
              <a href={props.url}>{props.name}</a>
          </li>
        );
    } else {
        return (
            <li>
                <a href={props.url}>{props.name}</a>
            </li>
        );
    }
}

