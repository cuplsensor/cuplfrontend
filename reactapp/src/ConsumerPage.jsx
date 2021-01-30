/*
 * Copyright (c) 2021. Plotsensor Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import {Header, Footer, Section} from "./BasePage"
import {Link} from "react-router-dom";
import {Star} from "./RecentStarred";
import TempUnitContext from "./TempUnitContext";


export class ConsumerBasePage extends React.Component {
    constructor(props) {
        super(props);

        this.changeUnit = (evt) => {
            const unit = evt.target.value;
            window.localStorage.setItem('TempUnit', unit);
            this.setState(state => ({
                unit:
                    state.unit = unit,
            }));
        };

        // State also contains the updater function so it will
        // be passed down into the context provider
        const defaultUnit = (navigator.language === "en-US") ? "F" : "C";
        this.state = {
            unit: window.localStorage.getItem('TempUnit') || defaultUnit,
            changeUnit: this.changeUnit,
        };
    }

    render() {
        return (
          <TempUnitContext.Provider value={this.state}>
                <div>
                  <ConsumerHeader bc={this.props.bc} />
                    <Section>
                        {this.props.children}
                    </Section>
                  <Footer />
                </div>
          </TempUnitContext.Provider>
      );
    }
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

function TempUnitSelect() {
    return (
            <TempUnitContext.Consumer>
                {({unit, changeUnit}) => (
                    <div className="select bluearrow">
                    <select value={unit} onChange={changeUnit}>
                        <option value="C">°C</option>
                        <option value="F">°F</option>
                    </select>
                </div>
                )}
            </TempUnitContext.Consumer>
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
                    <Link to="/admin/tags">Admin</Link>
                  </div>
                  <div className="navbar-item">
                    <TempUnitSelect />
                  </div>
                </div>
            </div>
        </Header>
        );
    }

}