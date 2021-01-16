import React from "react";
import {Link, withRouter } from "react-router-dom";
import {tempWithUnitStr, handleDismiss, TagErrorMessage} from "./BasePage";
import {getData, handleErrors, getTag, getCookie} from "./api.js";
import {ConsumerBasePage, ConsumerTagBC} from "./ConsumerPage";
import {DescriptionWidget} from "./DescriptionWidget";
import {DateTime} from 'luxon';
import thermometer from './thermometer-half-solid.svg';
import tint from './tint-solid.svg';
import battery from './battery-full-solid.svg';
import webhooks from './webhooks.svg';
import cogs from './cogs-solid.svg';
import TempUnitContext from "./TempUnitContext";


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
      // Display extra elements if tagtoken is present
      const tagtoken_exists = !!getCookie('tagtoken_' + this.props.serial);
      var latest_temp = null;
      var latest_rh = "-- %";
      var latest_batvoltagemv = "-- mV";
      var calendar_link = '#';
      var webhook_link = '#';
      var battery_link = '#';
      var configure_link = '#';
      var empty_set = true;

      if (tag) {
         if (tag.serial !== this.props.serial) {
          getTag.call(this, this.props.serial, true, true);
         }
      }

      if (latest_sample) {
          empty_set = false;
          latest_temp = latest_sample['temp'];
          if (latest_sample['rh'] !== null) {
              latest_rh = parseFloat(latest_sample['rh']).toFixed(2) + " %";
          }
      }
      if (typeof(latest_capture) != "string") {
          latest_batvoltagemv = latest_capture.batvoltagemv + " mV";
          calendar_link = "/tag/"+this.props.serial+"/calendar/day/"+latest_capture.timestamp;
          webhook_link = "/tag/"+this.props.serial+"/webhook";
          battery_link = "/tag/"+this.props.serial+"/battery";
          configure_link = "/tag/"+this.props.serial+"/configure";
      }

      return (
          <ConsumerBasePage bc={<ConsumerTagBC serial={this.props.serial} tagexists={this.state.tag} />}>
              <div className="container">
                  <TagErrorMessage error={this.state.error} serial={this.props.serial} handleDismiss={this.handleDismiss} />
                  <div className="columns">
                      <div className="column">
                          <TemperatureNavPanel
                              tempdegc_str={latest_temp}
                              link={calendar_link}
                              hide={empty_set}
                          />
                          <NavPanel
                              title="Humidity"
                              subtitle={latest_rh}
                              iconpath={tint}
                              link={calendar_link}
                              hide={empty_set}
                          />
                          <NavPanel
                              title="Webhook"
                              subtitle=""
                              iconpath={webhooks}
                              link={webhook_link}
                              hide={!tagtoken_exists}
                          />
                      </div>

                      <div className="column">
                          <NavPanel
                              title="Battery"
                              subtitle={latest_batvoltagemv}
                              iconpath={battery}
                              link={battery_link}
                              hide={empty_set}
                          />
                          <NavPanel
                              title="Configure"
                              subtitle="NFC"
                              iconpath={cogs}
                              link={configure_link}
                              hide={!tagtoken_exists}
                          />
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

class TemperatureNavPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = TempUnitContext;

    render() {
        const temp_unit = this.context.unit;
        const tempdegc_str = this.props.tempdegc_str;
        var latest_temp = tempWithUnitStr({tempdegc_str:null, unit:temp_unit});

        if (tempdegc_str) {
            latest_temp = tempWithUnitStr({tempdegc_str:tempdegc_str, unit:temp_unit});
        }

        return (
          <NavPanel
          title="Temperature"
          subtitle={latest_temp}
          iconpath={thermometer}
          link={this.props.link}
          hide={this.props.hide}
          />
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
    if (!props.hide) {
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
    } else {
        return "";
    }

}



export default withRouter(ConsumerTagPage);