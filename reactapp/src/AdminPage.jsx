import LoginForm from "./LoginForm";
import {BasePage, Footer, Header, Section} from "./BasePage";
import React from "react";
import {Link, Redirect, useLocation} from "react-router-dom";
import Cookies from 'universal-cookie';



export function AdminListCaptures() {
    return <AdminPage pagetitle="List of Captures" activetab="captures" />
}

export function AdminListWebhooks() {
    return <AdminPage pagetitle="List of Webhooks" activetab="webhooks" />
}

export function AdminLogin() {
    return (
        <AdminBasePage isLoggedIn={false}>
            <h5>Log in</h5>
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
        <Header>
            <div className="navbar-brand">

                    <div className="navbar-item ">
                        <div className="flex">
                            <div className="item">
                                <div className="inline-block">cupl</div>
                            </div>
                            <div className="item">
                                <div className="inline-block">{props.bc}
                                </div>
                            </div>
                        </div>

                    </div>

                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>

           </div>

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


function RedirectToLogin(props) {
    const location = useLocation();
    return (<Redirect to={{
        pathname: `/admin/login`,
        state: {referrer: location}
    }} />);
}

export class AdminPage extends BasePage {
    constructor(props) {
        super(props);
        const pagetitle = props.pagetitle;
        const activetab = props.activetab || '';
        this.state = {
            redirect: false,
            pagetitle: pagetitle,
            activetab: activetab
        };
    }

    componentDidMount() {
        const cookies = new Cookies();
        this.admintoken = cookies.get('admintoken');
        if (this.admintoken == null) {
            this.setState({'redirect': true});
        }
    }

    render() {
        if (this.state.redirect === true) {
          return <RedirectToLogin />
        }
        return(
            <AdminBasePage bc={this.props.bc} isLoggedIn={true}>
                <div className="columns">
                    <aside className="menu column is-2 is-fullheight">
                        {this.props.menu}
                    </aside>
                    <div className="column is-10">
                        {this.props.children}
                    </div>
                </div>
            </AdminBasePage>
        );
    }
}

export function AdminBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6 menu-label" aria-label="breadcrumbs">
        <ul>
            <li><a href="#">Admin</a></li>
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

