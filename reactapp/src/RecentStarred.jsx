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
import {HistorySubject} from "./star";
import {getTag} from "./api";
import starfill from './star-fill.svg'; // Tell webpack this JS file uses this image
import starempty from './star-empty.svg';
import {tempWithUnitStr} from "./BasePage";
import TempUnitContext from "./TempUnitContext";


export class RecentStarred extends React.Component {
    // Assign a contextType to read the current theme context.
    // React will find the closest theme Provider above and use its value.
    // In this example, the current theme is "dark".


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
            <table className="table">
                <thead>
                    <tr>
                        <th colSpan={5}>
                            <h5 className="title is-5 mb-2">Starred Tags</h5>
                        </th>
                    </tr>
                </thead>
                <TagTable taglist={starredarr} historysubject={this.historysubject} />
                <thead>
                    <tr>
                        <th style={{paddingTop: '1.5em'}} colSpan={5}>
                            <h5 className="title is-5 mb-2">Recent Tags</h5>
                        </th>
                    </tr>
                </thead>
                <TagTable taglist={recentarr} historysubject={this.historysubject} />
            </table>
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

class TagTableRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {error: false};
    }

    componentDidMount() {
        getTag.call(this, this.props.tagserial, false, true);
    }

    static contextType = TempUnitContext;

    render() {
        const latest_sample = this.state.latest_sample;
        const temp_unit = this.context.unit;
        var latest_temp = tempWithUnitStr({tempdegc_str:null, unit:temp_unit});
        var latest_rh = "-- %";
        var description = ""
        if (latest_sample) {
            latest_temp = tempWithUnitStr({tempdegc_str:latest_sample['temp'], unit:temp_unit});
            if (latest_sample['rh'] !== null) {
              latest_rh = parseFloat(latest_sample['rh']).toFixed(0) + " %";
            }
        }

        if (this.state.tag) {
            description = this.state.tag.description;
        }

        return (
            <tr>
                <td><a href={`tag/${this.props.tagserial}`}>{this.props.tagserial}</a></td>
                <td><Star historysubject={this.props.historysubject} serial={this.props.tagserial} tagexists={true} /></td>
                <td>{latest_temp}</td>
                <td>{latest_rh}</td>
                <td>{description}</td>
            </tr>
        );
    }
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

        if (this.props.tagexists && this.state.tagisnew && !this.viewonly) {
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
            backgroundImage = `url(${starfill})`;
        } else {
            backgroundImage = `url(${starempty})`;
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