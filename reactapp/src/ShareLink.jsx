import React from "react";
import {tempConverted} from "./BasePage";
import TempUnitContext from "./TempUnitContext";

export class ShareLinkButton extends React.Component {
    constructor(props) {
        super(props);

        this.share = this.share.bind(this);
        this.copylink = this.copylink.bind(this);
    }

    share() {
        navigator.share({
          title: this.props.name,
          url: window.location.href
        })
        .catch(console.error);
    }

    copylink() {
        var dummy = document.createElement('input'),
        text = window.location.href;
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
    }

    render() {
        if (navigator.share) {
            return(
               <a link="#" className="button is-text" onClick={this.share}>Share</a>
            );
        } else {
           return(
               <a link="#" className="button is-text" onClick={this.copylink}>Copy Link</a>
           );
        }

    }
}