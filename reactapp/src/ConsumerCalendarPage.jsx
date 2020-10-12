import React from "react";
import {withRouter } from "react-router-dom";
import {getData, handleErrors, getSamples} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {LineChart} from "./LineChart";
import 'chartjs-adapter-luxon';


class ConsumerCalendarPage extends React.Component {
  constructor(props) {
    super(props);

    var tag = null;

    if (props.location.state) {
        tag = props.location.state.tag;
    }

    this.state = {'error': false, 'tag': tag, 'samples': []};
  }

  componentDidMount() {
      if (this.state.tag == null) {
        getData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial,
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({tag: json})
            getSamples(this.state.tag.samples_url)
                .then((samples) => {
                  this.setState({'samples': samples});
              });
        },
        (error) => {
          this.setState({error});
        });
      } else {
          getSamples(this.state.tag.samples_url)
              .then((samples) => {
                  this.setState({'samples': samples});
              });
      }
  }

  render() {
      const error = this.state.error;
      var tagserial = "";

      if (this.state.tag) {
          tagserial = this.state.tag.serial;
      }

      return (
          <ConsumerBasePage bc={<ConsumerCalendarBC serial={tagserial} />}>
              <div id="chart-container">
                  <LineChart data={this.state.samples} tempcolor="rgba(220,100,94,1)" temptitle="temperature"
                  rhcolor="rgba(153,226,255,1)" rhtitle="RH"/>
              </div>

          </ConsumerBasePage>
      );
  }
}


function ConsumerCalendarBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href={`/tag/${props.serial}`}>{props.serial}</a></li>
            <li className="is-active"><a href="#" aria-current="page">Calendar</a></li>
        </ul>
      </nav>
    );
}

export default withRouter(ConsumerCalendarPage);