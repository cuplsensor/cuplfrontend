import React from "react";
import {Section} from "./BasePage";
import {HistorySubject} from "./star";


export class RecentStarred extends React.Component {
    constructor(props) {
        super(props);

        this.state = {starred:[], recents:[]};

    }

    update(updatedmodel) {
        console.log("UPDATED");
        this.setState({
            starred: updatedmodel.starred,
            recents: updatedmodel.recents
        });
    }

    componentDidMount() {
        this.historysubject = new HistorySubject();
        console.log("new history");
        this.historysubject.subscribe(this);
        this.setState({
            starred: this.historysubject.starred,
            recents: this.historysubject.recents
        });
    }

    componentWillUnmount() {
        delete this.historysubject;
    }

    render() {
        const starredarr = this.state.starred;
        const recentarr  = this.state.recents;
        return(
                <Section>
                    <table className="table">
                        <thead>
                            <h5 className="title is-5 mb-3">Starred Tags</h5>
                        </thead>
                        <TagTable taglist={starredarr} historysubject={this.historysubject} />
                        <thead>
                            <h5 className="title is-5 mt-4 mb-3">Recent Tags</h5>
                        </thead>
                        <TagTable taglist={recentarr} historysubject={this.historysubject} />
                    </table>
                </Section>
        );
    }
}

class TagTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let components = [];
        for(const tagserial of this.props.taglist) {
            components.push(
                <TagTableRow key={tagserial} historysubject={this.props.historysubject} tagserial={tagserial} />
            );
        }
        return(
            <tbody>
                {components}
            </tbody>
        );
    }
}

function TagTableRow(props) {
    return (
        <tr>
            <td><a href={`tag/${props.tagserial}`}>{props.tagserial}</a></td>
            <td><Star historysubject={props.historysubject} serial={props.tagserial} tagexists={true} /></td>
        </tr>
    );
}

export class Star extends React.Component {
    constructor(props) {
        super(props);

        if (props.historysubject) {
            this.historysubject = props.historysubject;
            this.viewonly = true;
        } else {
            console.log("new star history subject");
            this.historysubject = new HistorySubject();
            this.viewonly = false;
        }

        this.state = {starred: this.historysubject.is_starred(this.props.serial), tagisnew: true};
        this.handleStarClick = this.handleStarClick.bind(this);
    }

    componentDidMount() {
        if (this.viewonly) {
            this.historysubject.subscribe(this);
            console.log("subscribed star" + this.props.serial);
        }
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

        console.log("component did update");

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
        var backgroundImage;
        if (this.state.starred) {
            backgroundImage = `url(${require("./star-fill.svg")}`;
        } else {
            backgroundImage = `url(${require("./star-empty.svg")}`;
        }
        return (
            <a onClick={this.handleStarClick} style={{backgroundImage: backgroundImage,
                   backgroundRepeat: "no-repeat",
                   backgroundPosition: "center",
                   height: "1em",
                   width: "1em",
                   paddingRight: "1.0em",
                   paddingLeft: "1.3em"
        }}></a>
        );
    }
}