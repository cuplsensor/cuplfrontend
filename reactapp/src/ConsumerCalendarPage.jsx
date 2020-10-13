import React from "react";
import {withRouter } from "react-router-dom";
import {getData, handleErrors, getSamples} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {LineChart} from "./LineChart";
import 'chartjs-adapter-luxon';
import {DateTime} from "luxon";

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
              <CalendarForm />
              <div id="chart-container">
                  <LineChart data={this.state.samples} tempcolor="rgba(220,100,94,1)" temptitle="temperature"
                  rhcolor="rgba(153,226,255,1)" rhtitle="RH"/>
              </div>
          </ConsumerBasePage>
      );
  }
}

class RangePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {'range': 'day'};

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        this.setState({'range': event.target.id});
    }

    render() {
        var dayClassName = "button";
        var weekClassName = "button";
        var monthClassName = "button";

        if (this.state.range === "day") {
            dayClassName = "button is-active";
        }

        if (this.state.range === "week") {
            weekClassName = "button is-active";
        }

        if (this.state.range === "month") {
            monthClassName = "button is-active";
        }

        return  (<div className="level-right">
                <div className="level-item">
                    <div id="rangebuttons" className="buttons has-addons">
                        <span id="day" className={dayClassName} onClick={this.handleClick}>Day</span>
                        <span id="week" className={weekClassName} onClick={this.handleClick}>Week</span>
                        <span id="month" className={monthClassName} onClick={this.handleClick}>Month</span>
                    </div>
                </div>
            </div>
        )};
}


class CalendarForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {date: DateTime.local()};

        this.forwardOneDay = this.forwardOneDay.bind(this);
        this.backOneDay = this.backOneDay.bind(this);
        this.toToday = this.toToday.bind(this);
        this.toDatePicker = this.toDatePicker.bind(this);
    }

    toToday(event) {
        event.preventDefault();
        const newDate = DateTime.local();
        this.setState({date: newDate});
    }

    forwardOneDay(event) {
        event.preventDefault();
        const newDate = this.state.date.plus({days : 1});
        this.setState({date: newDate});
    }

    backOneDay(event) {
        event.preventDefault();
        const newDate = this.state.date.minus({days: 1});
        this.setState({date: newDate});
    }

    toDatePicker(event) {
        event.preventDefault();
        var datestr = event.target.value;
        const newDate = DateTime.fromISO(datestr);
        this.setState({date: newDate});
    }


    render() {
        const leftsvg = require("./angle-left-solid.svg");
        const rightsvg = require("./angle-right-solid.svg");
        return  (<nav id="daynav" className="level">
            <div className="level-left">
                <div className="level-item is-pulled-left">
                    <div id="daybuttons" className="buttons has-addons is-pulled-left">
                        <a className="button" id="leftbutton" onClick={this.backOneDay}>
                            <ArrowButton arrowpath={leftsvg}/>
                        </a>
                        <a className="button" id="todaybutton" onClick={this.toToday}>
                            Today
                        </a>
                        <a className="button" id="rightbutton" onClick={this.forwardOneDay}>
                            <ArrowButton arrowpath={rightsvg}/>
                        </a>
                    </div>
                </div>
                <div className="level-item">
                    <input type="date"
                           value={this.state.date.toISODate()}
                           id="datepicker"
                           onChange={this.toDatePicker}
                           style={{height:'2.25em', marginLeft:'0.5em'}}/>
                </div>
            </div>

            <RangePicker />
        </nav>
        )};
}

function ArrowButton(props) {
    return (
        <span className="icon" style={{backgroundImage: `url(${props.arrowpath})`,
                                                            backgroundRepeat: "no-repeat",
                                                            backgroundPosition: "center",
                                                            backgroundSize: "30%"}}/>
    );
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