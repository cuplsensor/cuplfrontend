/*
 * Copyright (c) 2021. Plotsensor Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import {DateTime} from "luxon";
import TempUnitContext from "./TempUnitContext";
import {tempWithUnitStr} from "./BasePage";

function groupSamplesByDay(samples) {
    // Assumes that all samples are already in chronological order.
    var samplesbyday = [];
    var samplesforcurrentday = [];
    var currentdt = null;

    if (samples[0]) {
        currentdt = samples[0].time;
    }

    for (const sample of samples) {
        const sampledt = sample.time;
        if (sampledt.day !== currentdt.day)
        {
            samplesbyday.push({datestr: currentdt.toLocaleString(DateTime.DATE_HUGE), samples: samplesforcurrentday});
            samplesforcurrentday = [];
            currentdt = sampledt;
        }

        samplesforcurrentday.push(sample);
    }

    if (samples[0]) {
        samplesbyday.push({datestr: currentdt.toLocaleString(DateTime.DATE_HUGE), samples: samplesforcurrentday});
    }
    return samplesbyday;
}

export function SamplesTable(props) {
    const samplesbyday = groupSamplesByDay(props.samples);
    let daytables = [];

    for (const daysamples of samplesbyday) {
        daytables.push(
            <DayTable key={daysamples.datestr} heading={daysamples.datestr} samples={daysamples.samples} />
        );
    }

    return (
        <div>
            {daytables}
        </div>
    );
}

function DayTable(props) {
    var tablerows = [];

    for (const sample of props.samples) {
        tablerows.push(<TableRow key={sample.time.toLocaleString(DateTime.TIME_24_SIMPLE)} time={sample.time.toLocaleString(DateTime.TIME_24_SIMPLE)} temp={sample['temp']} rh={sample['rh']} />);
    }
    return (
      <table className="table is-striped">
        <thead>
            <tr>
                <th className="stickyheading" colSpan="3">{props.heading}</th>
            </tr>
            <tr>
                <th>Time</th>
                <th><TemperatureHeading /></th>
                <th>RH %</th>
            </tr>
        </thead>
          <tbody>
            {tablerows}
          </tbody>
      </table>
    );
}

function TableRow(props) {
    var rh_str = "--";

    if (props.rh) {
        rh_str = parseFloat(props.rh).toFixed(0);
    }

    return (
      <tr>
          <td>{props.time}</td>
          <td><TemperatureText tempdegc_str={props.temp}/></td>
          <td>{rh_str}</td>
      </tr>
    );
}

class TemperatureHeading extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = TempUnitContext;

    render() {
        const temp_unit = this.context.unit;

        return "Temp °" + temp_unit;
    }
}

class TemperatureText extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = TempUnitContext;

    render() {
        const temp_unit = this.context.unit;
        var tempdegc_str = null;

        if (this.props.tempdegc_str) {
            tempdegc_str = this.props.tempdegc_str;
        }

        return tempWithUnitStr({tempdegc_str:tempdegc_str, unit:temp_unit, hideunit: true});
    }
}