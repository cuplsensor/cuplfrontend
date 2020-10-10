import React from "react";
import {Redirect, Link, withRouter } from "react-router-dom";
import {BasePage, BulmaField, BulmaControl, BulmaLabel, BulmaInput, BulmaSubmit, ErrorMessage} from "./BasePage.jsx";
import {getData, postData} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {ConsumerTagBC} from "./ConsumerTagPage";
import {DateTime} from 'luxon';



class ConsumerCapturesPage extends React.Component {
  constructor(props) {
    super(props);


    this.state = {'error': false};

  }

  componentDidMount() {
      getData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial,
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            //this.getLatestCapture(json['captures_url']);
        },
        (error) => {
          this.setState({error});
        });
  }

  render() {
      const error = this.state.error;

      return (
          <ConsumerBasePage bc={<ConsumerCapturesBC serial={this.props.serial} />}>

          </ConsumerBasePage>
      );
  }
}

function ConsumerCapturesBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href={`/tag/${props.serial}`}>{props.serial}</a></li>
            <li className="is-active"><a href="#" aria-current="page">Captures</a></li>
        </ul>
      </nav>
    );
}





export default withRouter(ConsumerCapturesPage);