import React from "react";
import {Redirect, Link, withRouter } from "react-router-dom";
import {handleDismiss, TagErrorMessage} from "./BasePage";
import {getData, handleErrors, getTag} from "./api.js";
import {ConsumerBasePage, ConsumerTagBC} from "./ConsumerPage";
import {DescriptionWidget} from "./DescriptionWidget";
import {DateTime} from 'luxon';
import thermometer from './thermometer-half-solid.svg';
import tint from './tint-solid.svg';
import battery from './battery-full-solid.svg';
import webhooks from './webhooks.svg';
import cogs from './cogs-solid.svg';




class ConsumerTagPage extends React.Component {
  constructor(props) {
    super(props);
    var error = false;

    if (this.props.location.state) {
        error = this.props.location.state.error;
        window.history.replaceState(null, '')
    }
    this.state = {'error': error, 'tag': null};

    this.handleDismiss = handleDismiss.bind(this);
    this.submitDone = this.submitDone.bind(this);
    this.submitError = this.submitError.bind(this);
  }

  submitDone() {
      getData(process.env.REACT_APP_WSB_ORIGIN + '/api/consumer/tag/' + this.props.serial,
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({tag: json})
        },
        (error) => {
          this.setState({error});
        });
  }

  submitError(error) {
      this.setState({error});
  }

  componentDidMount() {
    getTag.call(this, this.props.serial, true, true);
  }

  render() {
      const error = this.state.error;
      const latest_sample = this.state.latest_sample;
      const latest_capture = this.state.latest_capture || '';
      const tag = this.state.tag;
      var latest_temp = "-- °C";
      var latest_rh = "-- %";
      var latest_batvoltagemv = "-- mV";
      var calendar_link = '#';
      var webhook_link = '#';
      var battery_link = '#';

      if (tag) {
         if (tag.serial !== this.props.serial) {
          getTag.call(this, this.props.serial, true, true);
         }
      }

      if (latest_sample) {
          latest_temp = parseFloat(latest_sample['temp']).toFixed(2) + " °C";
          if (latest_sample['rh'] !== null) {
              latest_rh = parseFloat(latest_sample['rh']).toFixed(2) + " %";
          }
      }
      if (typeof(latest_capture) != "string") {
          latest_batvoltagemv = latest_capture.batvoltagemv + " mV";
          calendar_link = "/tag/"+this.props.serial+"/calendar/day/"+latest_capture.timestamp;
          webhook_link = "/tag/"+this.props.serial+"/webhook";
          battery_link = "/tag/"+this.props.serial+"/battery";
      }

      return (
          <ConsumerBasePage bc={<ConsumerTagBC serial={this.props.serial} tagexists={this.state.tag} />}>
              <div className="container">
                  <TagErrorMessage error={this.state.error} serial={this.props.serial} handleDismiss={this.handleDismiss} />
                  <div className="columns">
                      <div className="column">
                          <NavPanel
                              title="Temperature"
                              subtitle={latest_temp}
                              iconpath={thermometer}
                              link={calendar_link}
                          />
                          <NavPanel
                              title="Humidity"
                              subtitle={latest_rh}
                              iconpath={tint}
                              link={calendar_link}
                          />
                          <NavPanel
                              title="Webhook"
                              subtitle=""
                              iconpath={webhooks}
                              link={webhook_link}
                          />
                      </div>

                      <div className="column">
                          <NavPanel
                              title="Battery"
                              subtitle={latest_batvoltagemv}
                              iconpath={battery}
                              link={battery_link}
                          />
                          <NavPanel
                              title="Configure"
                              subtitle="WebNFC"
                              iconpath={cogs}/>
                      </div>

                  </div>

              </div>
              <DescriptionWidget tag={tag} submitDone={this.submitDone} submitError={this.submitError} />
              <div className="container mt-5">
                  <LatestCaptureLink capture={latest_capture} tag={this.state.tag} />
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
               <Link to={{pathname: `/tag/${props.capture.tagserial}/captures/`, state:{tag:props.tag}}}>List</Link> of all captures.
           </div>
       );
    }
}

function NavPanel(props) {
    return (
        <div className="tile box" >
                  <div className="tile is-child"
                       style={{backgroundImage: `url(${props.iconpath}`,
                               backgroundRepeat: "no-repeat",
                               backgroundPosition: "right"}}>
                      <a href={props.link}>
                          <p className="title">{props.title}</p>
                          <p className="subtitle">{props.subtitle}</p>
                      </a>
                  </div>
        </div>
    );
}



export default withRouter(ConsumerTagPage);