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
  return (
    <div>
      <AdminHeader isLoggedIn={isLoggedIn} />
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
            <div id="navbarBasicExample" className="navbar-menu">
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
            <AdminBasePage isLoggedIn={true}>
                <div className="tabs">
                    <ul id="navigation">
                        <ListElement name="Tags" url="/admin/tags" active={this.state.activetab} />
                        <ListElement name="Captures" url="/admin/captures" active={this.state.activetab} />
                        <ListElement name="Webhooks" url="/admin/webhooks" active={this.state.activetab} />
                    </ul>
                </div>
                <h5>{this.state.pagetitle}</h5>
                {this.props.children}
            </AdminBasePage>
        );
    }
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

