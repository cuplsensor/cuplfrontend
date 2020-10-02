import LoginForm from "./LoginForm";
import {Footer, Header, Section} from "./BasePage";
import React from "react";
import {Link, Redirect, useLocation} from "react-router-dom";
import Cookies from 'universal-cookie';

export function AdminListTags() {
    return <AdminPage pagetitle="List of Tags" activetab="tags" />
}

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

export function AdminBasePage(props) {
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

class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        const pagetitle = props.pagetitle;
        const activetab = props.activetab || '';
        this.state = {
            redirect: false,
            admintoken: '',
            pagetitle: pagetitle,
            activetab: activetab
        };
    }

    componentDidMount() {
        const cookies = new Cookies();
        let admintoken = cookies.get('admintoken');
        if (admintoken == null) {
            this.setState({'redirect': true});
        }
        this.setState({'admintoken': admintoken});
    }

    render() {
        if (this.state.redirect === true) {
          return <RedirectToLogin />
        }
        return(
            <AdminBasePage isLoggedIn={true}>
                <div className="tabs">
                    <ul id="navigation">
                        <ListElement activeon="tags" activetab={this.state.activetab}>
                            <a href="/admin/tags">Tags</a>
                        </ListElement>
                        <ListElement activeon="captures" activetab={this.state.activetab}>
                            <a href="/admin/captures">Captures</a>
                        </ListElement>
                        <ListElement activeon="webhooks" activetab={this.state.activetab}>
                            <a href="/admin/webhooks">Webhooks</a>
                        </ListElement>
                    </ul>
                </div>
                <h5>{this.state.pagetitle}</h5>
            </AdminBasePage>
        );
    }
}

function ListElement(props) {
    const activetab = props.activetab;
    const activeon = props.activeon;
    if (activeon === activetab) {
        return (
          <li className="is-active">
              {props.children}
          </li>
        );
    } else {
        return (
            <li>
                {props.children}
            </li>
        );
    }
}
