import React from "react";
import {Header, Footer, Section} from "./BasePage"
import {Link} from "react-router-dom";
import {Star} from "./RecentStarred";

export function ConsumerBasePage(props) {
  return (
    <div>
      <ConsumerHeader bc={props.bc} />
        <Section>
            {props.children}
        </Section>
      <Footer />
    </div>
  );
}

export function ConsumerTagBC(props) {
    return(
        <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
            <ul>
                <li>
                    <a className="mr-0 pr-0" href={`/tag/${props.serial}`}>{props.serial}</a>
                    <Star serial={props.serial} tagexists={props.tagexists} />
                </li>
                {props.children}
            </ul>
        </nav>
    );
}



export class ConsumerHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {burgerVisible: false};

        this.handleBurgerClick = this.handleBurgerClick.bind(this);
    }

    handleBurgerClick(event) {
        event.preventDefault();
        this.setState({burgerVisible: !this.state.burgerVisible});
    }

    render() {
        return (
        <Header bc={this.props.bc} burgerVisible={this.state.burgerVisible} burgerClickHandler={this.handleBurgerClick}>
            <div id="navbarBasicExample" className={this.state.burgerVisible ? "navbar-menu is-active" : "navbar-menu"}>
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

}