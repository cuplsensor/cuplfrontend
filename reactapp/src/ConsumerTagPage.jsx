import React from "react";
import {Redirect, Link, withRouter } from "react-router-dom";
import {BasePage, BulmaField, BulmaControl, BulmaLabel, BulmaInput, BulmaSubmit, ErrorMessage} from "./BasePage.jsx";
import {getData, handleErrors, getCookie} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {DateTime} from 'luxon';



class ConsumerTagPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {'error': false, 'tag': '', 'editdesc': false};

    this.editbuttonClickHandler = this.editbuttonClickHandler.bind(this);
    this.closebuttonHandler = this.closebuttonHandler.bind(this);
  }

  getLatestCapture(captures_url) {
      getData(captures_url,
          {},
          {page: 1, per_page: 1}
        )
        .then(handleErrors)
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
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({latest_sample: json[0]});
        },
        (error) => {
          this.setState({error});
        });
  }

  componentDidMount() {
    const tagtoken = getCookie('tagtoken_' + this.props.serial);
    this.setState({tagtoken: tagtoken});
    getData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial,
        )
        .then(handleErrors)
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

  closebuttonHandler(event) {
      event.preventDefault();
      this.setState({editdesc: false});
  }

  editbuttonClickHandler(event) {
      event.preventDefault();
      this.setState({editdesc: true});
  }

  render() {
      const error = this.state.error;
      const latest_sample = this.state.latest_sample;
      const latest_capture = this.state.latest_capture || '';
      var latest_temp = "-- °C";
      var latest_rh = "-- %";
      var latest_batvoltagemv = "-- mV";
      var calendar_link = '#';

      if (latest_sample) {
          latest_temp = parseFloat(latest_sample['temp']).toFixed(2) + " °C";
          if (latest_sample['rh'] !== null) {
              latest_rh = parseFloat(latest_sample['rh']).toFixed(2) + " %";
          }
      }
      if (typeof(latest_capture) != "string") {
          latest_batvoltagemv = latest_capture.batvoltagemv + " mV";
          calendar_link = "/tag/"+this.props.serial+"/calendar/day/"+latest_capture.timestamp;
      }

      return (
          <ConsumerBasePage bc={<ConsumerTagBC serial={this.props.serial} />}>
              <div className="container">
                  <div className="columns">
                      <div className="column">
                          <NavPanel
                              title="Temperature"
                              subtitle={latest_temp}
                              iconpath={require("./thermometer-half-solid.svg")}
                              link={calendar_link}
                          />
                          <NavPanel
                              title="Relative Humidity"
                              subtitle={latest_rh}
                              iconpath={require("./tint-solid.svg")}
                              link={calendar_link}
                          />

                          <NavPanel
                              title="Webhook"
                              subtitle=""
                              iconpath={require("./webhooks.svg")}/>
                      </div>

                      <div className="column">
                          <NavPanel
                              title="Battery"
                              subtitle={latest_batvoltagemv}
                              iconpath={require("./battery-full-solid.svg")}/>
                          <NavPanel
                              title="Configure"
                              subtitle="WebNFC"
                              iconpath={require("./cogs-solid.svg")}/>
                      </div>

                  </div>

              </div>
              <Description clickHandler={this.editbuttonClickHandler} tagtoken={this.state.tagtoken} description={this.state.tag.description} />
              <div className="container mt-5">
                  <LatestCaptureLink capture={latest_capture} tag={this.state.tag} />
              </div>
              <DescriptionEditor closebtnHandler={this.closebuttonHandler} editdesc={this.state.editdesc} />

          </ConsumerBasePage>
      );
  }
}

function DescriptionEditor(props) {
    return (
        <div className={props.editdesc ? 'modal is-active': 'modal'}>
          <div className="modal-background" onClick={props.closebtnHandler}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Edit Description</p>
                    <button className="delete" aria-label="close" onClick={props.closebtnHandler}></button>
                </header>
                <section className="modal-card-body">

                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success">Save changes</button>
                    <button className="button" onClick={props.closebtnHandler}>Cancel</button>
                </footer>
            </div>
       </div>
    );
}

function Description(props) {
    if (props.description) {
        return(
            <div className="container mt-5">
                <p><DescriptionLabel clickHandler={props.clickHandler} tagtoken={props.tagtoken}/> {props.description} </p>
            </div>
        );
    } else {
        return('');
    }
}

function DescriptionLabel(props) {
    if (props.tagtoken) {
        return(<a href='#' onClick={props.clickHandler}>Edit Description:</a>)
    } else {
        return("Description:");
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