import React from "react";
import {Redirect, withRouter} from "react-router-dom";
import {getData, handleErrors, getSamples} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {LineChart} from "./LineChart";

import {DateTime} from "luxon";
import 'chartjs-adapter-luxon';



class ConsumerCalendarPage extends React.Component {
  constructor(props) {
    super(props);

    var tag = null;

    if (props.location.state) {
        tag = props.location.state.tag;
    }

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);


    const zone = new URLSearchParams(this.props.location.search).get("tz") || 'local';
    const dateToday = DateTime.local()
    const range = this.props.range || 'day';
    const year = this.props.year || dateToday.year;
    const month = this.props.month || dateToday.month;
    const day = this.props.day || dateToday.day;

    const date = DateTime.fromObject({year:year, month:month, day:day, zone:zone});

    this.state = {'error': false, 'tag': tag, 'samples': [], 'range': range, 'date': date, 'sEDates': {}};
  }

  updateAll() {
      var startDatesEqual = false;
      var endDatesEqual = false;
      this.updateURL();

      const sEDates = this.startEndDates(this.state.date, this.state.range);
      if (this.state.sEDates.startDate && this.state.sEDates.endDate) {
          startDatesEqual = sEDates.startDate.toMillis() === this.state.sEDates.startDate.toMillis();
          endDatesEqual = sEDates.endDate.toMillis() === this.state.sEDates.endDate.toMillis();
      }

      if (!startDatesEqual || !endDatesEqual) {
          const startISO = sEDates.startDate.toISO();
          const endISO = sEDates.endDate.toISO();
          const extraparams = {starttimestr: startISO, endtimestr: endISO};

          getSamples(this.state.tag.samples_url, extraparams, this.state.date.zone)
                    .then((samples) => {
                      this.setState({'samples': samples, 'sEDates': sEDates});
                  });
      }
  }

  updateURL() {
      const serial = this.state.tag.serial;
      const range = this.state.range;
      const day = this.state.date.day;
      const month = this.state.date.month;
      const year = this.state.date.year;
      const zone = this.state.date.zoneName;
      const url = `/tag/${serial}/calendar/${range}/${year}/${month}/${day}`;
      const params = "?tz=" + zone;
      const search = new URLSearchParams(params).toString();
      this.props.history.push({pathname: url, search: search});
  }

  // Calculate start and end dates for the selected date.
  startEndDates(selDate, range) {
      var startDate = selDate.set({hour: 0, minute: 0, second: 0, millisecond: 0});
      var endDate;

      if (range == "day") {
          endDate = startDate.plus({days: 1});
      } else if (range == "week") {
          startDate = startDate.set({weekday: 1}); // Set to Monday.
          endDate = startDate.plus({weeks: 1}); // Set to Monday of the next week.
      } else if (range == "month") {
          startDate = startDate.set({day: 1}); // Set to first day of the month.
          endDate = startDate.plus({months: 1}); // Set to the first day of the start of the next month.
      }
      return {startDate: startDate, endDate: endDate};
  }

  handleDateChange(date) {
      this.setState({'date': date}, this.updateAll);
  }

  handleRangeChange(range) {
      this.setState({'range': range}, this.updateAll);
    }

  componentDidMount() {
      if (this.state.tag == null) {
        getData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial,
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({tag: json}, this.updateAll)
        },
        (error) => {
          this.setState({error});
        });
      } else {
          this.updateAll();
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
              <nav id="daynav" className="level">
                  <DatePicker date={this.state.date} onDateChange={this.handleDateChange} />
                  <RangePicker range={this.state.range} onRangeChange={this.handleRangeChange} />
              </nav>
              <div id="chart-container">
                  <LineChart data={this.state.samples}
                             tempcolor="rgba(220,100,94,1)"
                             temptitle="temperature"
                             rhcolor="rgba(153,226,255,1)"
                             rhtitle="RH"
                             xmin={this.state.sEDates.startDate}
                             xmax={this.state.sEDates.endDate}
                  />
              </div>
          </ConsumerBasePage>
      );
  }
}

class RangePicker extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        //this.setState({'range': event.target.id});
        this.props.onRangeChange(event.target.id);
    }

    render() {
        var dayClassName = "button";
        var weekClassName = "button";
        var monthClassName = "button";

        if (this.props.range === "day") {
            dayClassName = "button is-active";
        }

        if (this.props.range === "week") {
            weekClassName = "button is-active";
        }

        if (this.props.range === "month") {
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


class DatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.forwardOneDay = this.forwardOneDay.bind(this);
        this.backOneDay = this.backOneDay.bind(this);
        this.toToday = this.toToday.bind(this);
        this.toDatePicker = this.toDatePicker.bind(this);
    }

    toToday(event) {
        event.preventDefault();
        const newDate = DateTime.fromObject({zone: this.props.date.zone});
        this.props.onDateChange(newDate);
    }

    forwardOneDay(event) {
        event.preventDefault();
        const newDate = this.props.date.plus({days : 1});
        this.props.onDateChange(newDate);
    }

    backOneDay(event) {
        event.preventDefault();
        const newDate = this.props.date.minus({days: 1});
        this.props.onDateChange(newDate);
    }

    toDatePicker(event) {
        event.preventDefault();
        var datestr = event.target.value;
        const newDate = DateTime.fromISO(datestr, {zone: this.props.date.zone});
        this.props.onDateChange(newDate);
    }


    render() {
        const leftsvg = require("./angle-left-solid.svg");
        const rightsvg = require("./angle-right-solid.svg");
        return  (
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
                           value={this.props.date.toISODate()}
                           id="datepicker"
                           onChange={this.toDatePicker}
                           style={{height:'2.25em', marginLeft:'0.5em'}}/>
                </div>
            </div>
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