import React from "react";
import {TagTable} from "./TagTable";
import {Section} from "./BasePage";
import {HistorySubject} from "./star";


export class RecentStarred extends React.Component {
    constructor(props) {
        super(props);

        this.historysubject = new HistorySubject();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        delete this.historysubject;
    }

    render() {
        const starredarr = this.historysubject.starred;
        const recentarr  = this.historysubject.recents;
        return(
            <div>
                <Section>
                    <TagTable name="Starred Tags" taglist={starredarr} />
                </Section>
                <Section>
                    <TagTable name="Recent Tags" taglist={recentarr} />
                </Section>
            </div>
        );
    }
}