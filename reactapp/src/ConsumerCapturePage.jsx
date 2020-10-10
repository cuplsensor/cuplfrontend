import React from "react";
import {Redirect, Link, withRouter } from "react-router-dom";
import {BasePage, BulmaField, BulmaControl, BulmaLabel, BulmaInput, BulmaSubmit, ErrorMessage} from "./BasePage.jsx";
import {getData, postData} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {ConsumerTagBC} from "./ConsumerTagPage";
import {DateTime} from 'luxon';



class ConsumerCapturePage extends React.Component {
  constructor(props) {
    super(props);

    var capture = null;

    if (props.location.state) {
        capture = props.location.state.capture;
    }

    this.state = {'error': false, 'capture': capture};

  }

  componentDidMount() {
      if (this.state.capture == null) {
        getData('https://b3.websensor.io/api/consumer/captures/' + this.props.id,
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            this.setState({capture: json})

        },
        (error) => {
          this.setState({error});
        });
      }
  }

  render() {
      const error = this.state.error;
      var tagserial = "";

      var capture_id = "";

      if (this.state.capture) {
          tagserial = this.state.capture.tagserial;
          capture_id = this.state.capture.id;
      }

      return (
          <ConsumerBasePage bc={<ConsumerCaptureBC serial={tagserial} capture_id={capture_id} />}>

          </ConsumerBasePage>
      );
  }
}

function ConsumerCaptureBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href={`/tag/${props.serial}`}>{props.serial}</a></li>
            <li><a href={`/tag/${props.serial}/captures/`}>Captures</a></li>
            <li className="is-active"><a href="#" aria-current="page">{props.capture_id}</a></li>
        </ul>
      </nav>
    );
}





export default withRouter(ConsumerCapturePage);