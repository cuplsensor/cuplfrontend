import React from "react";
import {Redirect, Link, withRouter } from "react-router-dom";
import {BasePage, BulmaField, BulmaControl, BulmaLabel, BulmaInput, BulmaSubmit, ErrorMessage} from "./BasePage.jsx";
import {getData, postData} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {DateTime} from 'luxon';



class ConsumerTagPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {'error': false, 'tag': '', 'latest_capture': ''};

  }

  getLatestCapture(captures_url) {
      getData(captures_url,
          {},
          {page: 1, per_page: 1}
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            if (json[0] == null) {
                this.setState({latest_capture: "No captures on this tag."});
            } else {
                this.setState({latest_capture: json[0]});
            }
        },
        (error) => {
          this.setState({error});
        });
  }

  getLatestSample(samples_url) {
      getData(samples_url,
          {},
          {page: 1, per_page: 1}
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({latest_sample: json[0]});
        },
        (error) => {
          this.setState({error});
        });
  }

  componentDidMount() {
    getData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial,
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({tag: json})
            this.getLatestSample(json['samples_url']);
            this.getLatestCapture(json['captures_url']);
        },
        (error) => {
          this.setState({error});
        });
  }

  render() {
      const error = this.state.error;
      const latest_sample = this.state.latest_sample;
      const latest_capture = this.state.latest_capture;
      var latest_temp = "-- °C";
      var latest_rh = "-- %";
      var latest_batvoltagemv = "-- mV";

      if (latest_sample) {
          latest_temp = parseFloat(latest_sample['temp']).toFixed(2) + " °C";
          latest_rh = parseFloat(latest_sample['rh']).toFixed(2) + " %";
      }
      if (latest_capture) {
          latest_batvoltagemv = latest_capture.batvoltagemv + " mV";
      }

      return (
          <ConsumerBasePage bc={<ConsumerTagBC serial={this.props.serial} />}>
              <div className="container">
                  <div className="columns">
                      <div className="column">
                          <NavPanel title="Temperature" subtitle={latest_temp} iconpath={require("./thermometer-half-solid.svg")}/>
                          <NavPanel title="Relative Humidity" subtitle={latest_rh} iconpath={require("./tint-solid.svg")}/>
                          <NavPanel title="Webhook" subtitle="" iconpath={require("./webhooks.svg")}/>
                      </div>


                      <div className="column">
                          <NavPanel title="Battery" subtitle={latest_batvoltagemv} iconpath={require("./battery-full-solid.svg")}/>
                          <NavPanel title="Configure" subtitle="WebNFC" iconpath={require("./cogs-solid.svg")}/>
                      </div>



                  </div>

              </div>
              <div className="container mt-5">
                  <LatestCaptureLink capture={latest_capture} />


              </div>
          </ConsumerBasePage>
      );
  }
}

function LatestCaptureLink(props) {
    if (typeof(props.capture) == "string") {
        return (props.capture);
    } else {
       const latest_timestamp = DateTime.fromISO(props.capture.timestamp).toRelativeCalendar();
       return (
           <div>
               <Link to={{pathname: `/tag/${props.capture.tagserial}/captures/${props.capture.id}`, state:{capture:props.capture}}}>Latest capture</Link> taken {latest_timestamp}.
               <br/>
               <Link to={{pathname: `/tag/${props.capture.tagserial}/captures/`}}>List</Link> of all captures.
           </div>
       );
    }
}

function NavPanel(props) {
    const iconstr = require("./tint-solid.svg");
    const iconpath = `${iconstr}`;
    console.log(iconpath);
    return (
        <div className="tile box" >
                  <div className="tile is-child"
                       style={{backgroundImage: `url(${props.iconpath}`,
                               backgroundRepeat: "no-repeat",
                               backgroundPosition: "right"}}>
                      <a href="#">
                          <p className="title">{props.title}</p>
                          <p className="subtitle">{props.subtitle}</p>
                      </a>
                  </div>
        </div>
    );
}

export function ConsumerTagBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href="#">{props.serial}</a></li>
        </ul>
      </nav>
    );
}



export default withRouter(ConsumerTagPage);