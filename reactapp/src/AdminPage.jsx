import LoginForm from "./LoginForm";
import {Footer, Header, Section} from "./BasePage";
import React from "react";
import {Link, Redirect, useLocation} from "react-router-dom";
import {RemoveAdminToken} from "./api";
import {AdminConfigSubMenu} from "./AdminTagPage";

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
      <AdminHeader bc={bc} isLoggedIn={isLoggedIn} logout={props.logout}/>
          <Section>
              {props.children}
          </Section>
      <Footer />
    </div>
  );
}

export class AdminHeader extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            burgerVisible: false,
        };

        this.handleBurgerClick = this.handleBurgerClick.bind(this);
    }

    handleBurgerClick(event) {
        event.preventDefault();
        this.setState({burgerVisible: !this.state.burgerVisible});
    }

    render() {
        const isLoggedIn = this.props.isLoggedIn;

        return (
        <Header bc={this.props.bc} burgerVisible={this.state.burgerVisible} burgerClickHandler={this.handleBurgerClick}>
            <div id="navbarBasicExample" className={this.state.burgerVisible ? "navbar-menu is-active" : "navbar-menu"}>
                <div className="navbar-start ">

                </div>
                <div className="navbar-end">
                    <AdminLogOutButton isLoggedIn={isLoggedIn} logout={this.props.logout} />
                </div>
            </div>
        </Header>
    );
    }

}

class AdminLogOutButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const isLoggedIn = this.props.isLoggedIn;
        if (isLoggedIn) {
            return(
                <div className="navbar-item">
                    <a href="#" className="button" onClick={this.props.logout}>Log Out</a>
                </div>
                );
        } else {
            return('');
        }
    }
}

export function RedirectToLogin(props) {
    const location = useLocation();
    const error = props.error;
    if (error) {
          if (error.code ===401) {
              return (
                  <Redirect to={{
                    pathname: `/admin/login`,
                    state: {referrer: location, error: error}}} />
                  );
          }
        }
    return ('');
}

export class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {isLoggedIn: true};

        this.logout = this.logout.bind(this);
    }

    logout() {
        RemoveAdminToken();
        this.setState({isLoggedIn: false});
    }

    render() {
        if (this.state.isLoggedIn === false) {
            return <Redirect to="/" />
        }
        return(
            <AdminBasePage bc={this.props.bc} isLoggedIn={this.state.isLoggedIn} logout={this.logout}>
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

function AdminLoginBC(props) {
    return (
      <AdminBC>
            <li className="is-active"><a href="#" aria-current="page">Log In</a></li>
      </AdminBC>
    );
}


export function AdminBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href="/admin/tags">Admin</a></li>
            {props.children}
        </ul>
      </nav>
    );
}

function TagSubMenu(props) {
    const isHidden = !((props.activetab.toLowerCase() === "tags") || (props.activetab.toLowerCase() === "add"));
    return (
        <div className={isHidden ? "is-hidden" : "is-block"}>
            <ul>
                <MenuListElement name="Add" url={'/admin/tags/add'} active={props.activetab}/>
            </ul>
        </div>
    )
}

export function AdminMenu(props) {
    return (
        <div>
            <ul className="menu-list">
                <MenuListElement name="Tags" url="/admin/tags" active={props.activetab} children={<TagSubMenu name="Tags" url="/admin/tags/add" activetab={props.activetab} />} />
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
              {props.children}
          </li>
        );
    } else {
        return (
            <li>
                <a href={props.url}>{props.name}</a>
                {props.children}
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

