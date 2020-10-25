import React from "react";
import {Header, Footer, Section} from "./BasePage"
import {Link} from "react-router-dom";
import {HistorySubject} from "./star";

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

export class ConsumerTagBC extends React.Component {
    constructor(props) {
        super(props);

        this.historysubject = new HistorySubject();
        this.state = {starred: this.historysubject.is_starred(this.props.serial), tagisnew: true};
        this.handleStarClick = this.handleStarClick.bind(this);
    }

    componentWillUnmount() {
        delete this.historysubject;
    }

    componentDidUpdate(prevprops) {
        if (!this.state.tagisnew) {
            if (prevprops.serial !== this.props.serial) {
                this.setState({tagisnew: true});
            }
        }

        if (this.props.tagexists && this.state.tagisnew) {
            this.historysubject.update_recent(this.props.serial);
            this.historysubject.subscribe(this);
            this.setState({tagisnew: false});
        }
    }

    update(updatedmodel) {
        var starred = updatedmodel.is_starred(this.props.serial);
        this.setState({starred: starred});
    }

    handleStarClick() {
        this.historysubject.toggle_starred(this.props.serial);
    }

    // https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images
    render() {
        return (
            <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
                <ul>
                    <li>
                        <a className="mr-0 pr-0" href={`/tag/${this.props.serial}`}>{this.props.serial}</a>
                        <StarIcon filled={this.state.starred} handleClick={this.handleStarClick} />
                    </li>
                    {this.props.children}
                </ul>
            </nav>
        );
    }
}

function StarIcon(props) {
    var backgroundImage;
    if (props.filled) {
        backgroundImage = `url(${require("./star-fill.svg")}`;
    } else {
        backgroundImage = `url(${require("./star-empty.svg")}`;
    }
    return (
        <a onClick={props.handleClick} style={{backgroundImage: backgroundImage,
                   backgroundRepeat: "no-repeat",
                   backgroundPosition: "center",
                   height: "1em",
                   width: "1em",
                   paddingRight: "1.0em",
                   paddingLeft: "1.3em"
        }}></a>
    );
}

function ConsumerHeader(props) {
    return (
        <Header bc={props.bc}>
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