import React from "react";
import {withRouter } from "react-router-dom";
import {getData, handleErrors, getSamples} from "./api.js";
import {ConsumerBasePage, ConsumerTagBC} from "./ConsumerPage";
import {LineChart} from "./LineChart";
import 'chartjs-adapter-luxon';
import {CaptureErrorMessage, handleDismiss, Section} from "./BasePage";
import {SamplesTable} from "./SamplesTable";


class ConsumerCapturePage extends React.Component {
  constructor(props) {
    super(props);

    var capture = null;

    if (props.location.state) {
        capture = props.location.state.capture;
    }

    this.handleDismiss = handleDismiss.bind(this);
    this.state = {'error': false, 'capture': capture, 'samples': []};
  }

  componentDidMount() {
      if (this.state.capture == null) {
        getData(process.env.REACT_APP_WSB_ORIGIN + '/api/consumer/captures/' + this.props.id,
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
      var tagserial = "";
      var capture_id = this.props.id;

      if (this.state.capture) {
          tagserial = this.state.capture.tagserial;
      }

      return (
          <ConsumerBasePage bc={<ConsumerCaptureBC serial={tagserial} tagexists={tagserial !== ""} capture_id={capture_id} />}>
              <CaptureErrorMessage error={this.state.error} id={capture_id} handleDismiss={this.handleDismiss}/>
              <div id="chart-container">
                  <LineChart data={this.state.samples} tempcolor="rgba(220,100,94,1)" temptitle="temperature"
                  rhcolor="rgba(153,226,255,1)" rhtitle="RH"/>
              </div>
              <div className="container">
                 <SamplesTable samples={this.state.samples} />
              </div>


          </ConsumerBasePage>
      );
  }
}


function ConsumerCaptureBC(props) {
    return (
        <ConsumerTagBC serial={props.serial} tagexists={props.tagexists}>
            <li><a href={`/tag/${props.serial}/captures/`}>Captures</a></li>
            <li className="is-active"><a href="#" aria-current="page">{props.capture_id}</a></li>
        </ConsumerTagBC>
    );
}

export default withRouter(ConsumerCapturePage);