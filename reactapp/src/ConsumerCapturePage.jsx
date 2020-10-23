import React from "react";
import {withRouter } from "react-router-dom";
import {getData, handleErrors, getSamples} from "./api.js";
import {ConsumerBasePage, ConsumerBC} from "./ConsumerPage";
import {LineChart} from "./LineChart";
import 'chartjs-adapter-luxon';


class ConsumerCapturePage extends React.Component {
  constructor(props) {
    super(props);

    var capture = null;

    if (props.location.state) {
        capture = props.location.state.capture;
    }

    this.state = {'error': false, 'capture': capture, 'samples': []};
  }

  componentDidMount() {
      if (this.state.capture == null) {
        getData('https://b3.websensor.io/api/consumer/captures/' + this.props.id,
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({capture: json})
            getSamples(this.state.capture.samples_url)
                .then((samples) => {
                  this.setState({'samples': samples});
              });
        },
        (error) => {
          this.setState({error});
        });
      } else {
          getSamples(this.state.capture.samples_url)
              .then((samples) => {
                  this.setState({'samples': samples});
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
              <div id="chart-container">
                  <LineChart data={this.state.samples} tempcolor="rgba(220,100,94,1)" temptitle="temperature"
                  rhcolor="rgba(153,226,255,1)" rhtitle="RH"/>
              </div>

          </ConsumerBasePage>
      );
  }
}


function ConsumerCaptureBC(props) {
    return (
        <ConsumerBC serial={props.serial}>
            <li><a href={`/tag/${props.serial}/captures/`}>Captures</a></li>
            <li className="is-active"><a href="#" aria-current="page">{props.capture_id}</a></li>
        </ConsumerBC>
    );
}

export default withRouter(ConsumerCapturePage);