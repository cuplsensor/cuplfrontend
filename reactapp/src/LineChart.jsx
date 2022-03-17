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
import {Chart} from "chart.js";
import 'chartjs-adapter-luxon';
// https://stackoverflow.com/questions/42691873/draw-horizontal-line-on-chart-in-chart-js-on-v2
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import TempUnitContext from "./TempUnitContext";
import {tempConverted} from "./BasePage";

Chart.plugins.register([ChartAnnotation]); // Global

export class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.DateTime = DateTime;
    }

    static contextType = TempUnitContext;

    decimateData() {
        var sampledata = this.props.data;
        var datalength = sampledata.length;
        const maxlength = 700;
        const dlfactor = Math.round(datalength / maxlength);
        console.log(dlfactor);



        if (dlfactor > 1) {
            var decimated = Array();
            for (var i = 0; i < datalength; i=i+dlfactor) {
              decimated.push(sampledata[i]);
            }
            sampledata = decimated;
        }

        return sampledata;
    }

    componentDidUpdate() {
        const xmin = this.props.xmin || null;
        const xmax = this.props.xmax || null;
        const unit = this.context.unit;

        if (xmin !== null) {
            this.myChart.options.scales.xAxes[0].ticks.min = xmin;
        }

        if (xmax !== null) {
            this.myChart.options.scales.xAxes[0].ticks.max = xmax;
        }

        const timerangems = this.myChart.options.scales.xAxes[0].ticks.max - this.myChart.options.scales.xAxes[0].ticks.min;
        const timerange2days = 86400000 * 2;
        var timeunit = "hour";
        var pointradius = 3;

        if (timerangems > timerange2days) {
            timeunit = 'day';
            pointradius = 3;
        }

        this.myChart.options.scales.xAxes[0].time.unit = timeunit;
        this.myChart.data.datasets[0].pointRadius = pointradius;
        this.myChart.data.datasets[1].pointRadius = pointradius;


        const sampledata = this.decimateData();
        this.myChart.data.labels = sampledata.map(d => d.time);
        this.myChart.data.datasets[0].label = "Temp °"+unit;
        this.myChart.options.scales.yAxes[0].scaleLabel.labelString = "Temp °"+unit;
        this.myChart.data.datasets[0].data = sampledata.map(d => tempConverted(d.temp, unit));
        this.myChart.data.datasets[1].data = sampledata.map(d => d.rh);

        console.log();
        this.myChart.update();
    }

    parserCallback(dateTimeIn) {
        // An unfortunate hack to get around the fact that Chart.JS with the Luxon adapter
        // always uses the local timezone to format ticks and tooltips and not the supplied zone
        // data from Luxon. This might be fixed time Chart.JS 3.
        // What this does is change the underlying timestamp, whilst simultaenously changing the zone
        // to ensure that the displayed local time does not change.
        if (typeof dateTimeIn.setZone == "function") {
            return dateTimeIn.setZone('local', { keepLocalTime: true });
        } else {
            // In the case of the xmin and xmax values, invalid DateTime objects are passed to this function.
            // The setZone function cannot be called on these, so I recreate these objects as DateTime first.
            return this.DateTime.fromMillis(dateTimeIn.ts, {zone: dateTimeIn._zone.zoneName}).setZone('local', { keepLocalTime: true });
        }
    }

    componentDidMount() {
        const unit = this.context.unit;
        const sampledata = this.decimateData();

        this.myChart = new Chart(this.chartRef.current, {
                          type: 'line',
                          options: {
                              animation: false,
                              hover: {
                                  animationDuration: 0 // duration of animations when hovering an item
                                },
                              elements: {
                              line: {
                                tension: 0 // disables bezier curves
                              }
                            },
                             tooltips : {
                                mode : 'index', intersect: false,
                                 callbacks: {
                                    label: function(tooltipItem, data) {
                                        var label = data.datasets[tooltipItem.datasetIndex].label || '';

                                        if (label) {
                                            label += ': ';
                                        }
                                        label += tooltipItem.yLabel.toFixed(1);
                                        return label;
                                    }
                                 }
                             },
                            scales: {
                              xAxes: [
                                {
                                  type: 'time',
                                  time: {
                                    parser: function (dateTimeIn) {
                                        return this.parserCallback(dateTimeIn);
                                    }.bind(this)
                                  },
                                    ticks: {
                                      maxTicksLimit: 8,
                                    }
                                }
                              ],
                                yAxes: [{
                                    id: 'tempAxis',
                                    type: 'linear',
                                    position: 'left',
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Temp °"+unit
                                      },
                                }, {

                                    id: 'rhAxis',
                                    type: 'linear',
                                    position: 'right',
                                    scaleLabel: {
                                        display: true,
                                        labelString: "RH %"
                                      },
                                    display: true
                                }],
                            },
                          },
                        data: {
                              labels: this.props.data.map(d => d.time),
                                datasets: [{
                                  label: "Temp °"+unit,
                                  data: sampledata.map(d => tempConverted(d.temp, unit)),
                                  fill: 'none',
                                  backgroundColor: this.props.tempcolor,
                                  pointRadius: 3,
                                  borderColor: this.props.tempcolor,
                                  borderWidth: 1,
                                  lineTension: 0,
                                  yAxisID: 'tempAxis',
                                },
                                {
                                  label: "RH %",
                                  data: sampledata.map(d => d.rh),
                                  fill: 'none',
                                  backgroundColor: this.props.rhcolor,
                                  pointRadius: 3,
                                  borderColor: this.props.rhcolor,
                                  borderWidth: 1,
                                  lineTension: 0,
                                  yAxisID: "rhAxis",
                                  hidden: false
                                }]
                        }
                    });
    }

    render() {
        return <canvas ref={this.chartRef} />;
    }
}

export class BatteryLineChart extends LineChart {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const xmin = this.props.xmin || null;
        const xmax = this.props.xmax || null;

        if (xmin !== null) {
            this.myChart.options.scales.xAxes[0].ticks.min = xmin;
        }

        if (xmax !== null) {
            this.myChart.options.scales.xAxes[0].ticks.max = xmax;
        }

        this.myChart.data.labels = this.props.data.map(d => d.time);
        this.myChart.data.datasets[0].data = this.props.data.map(d => d.batvoltagemv);
        this.myChart.update();
    }

    componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
                          type: 'line',
                          options: {
                              animation: false,
                             tooltips : {
                                mode : 'index', intersect: false,
                            },
                            scales: {
                              xAxes: [
                                {
                                  type: 'time',
                                  time: {
                                    unit: 'day',
                                    parser: function (dateTimeIn) {
                                        return this.parserCallback(dateTimeIn);
                                    }.bind(this)
                                  }
                                }
                              ],
                                yAxes: [{
                                    id: 'batAxis',
                                    type: 'linear',
                                    position: 'left',
                                    ticks: {
                                        min: 1800
                                    }
                                }],
                            },
                            annotation: {
                              annotations: [{
                                type: 'line',
                                mode: 'horizontal',
                                scaleID: 'batAxis',
                                value: 2200,
                                borderColor: 'red',
                                borderWidth: 1,
                                label: {
                                  enabled: false,
                                  content: 'Test label'
                                }
                              }]
                            }
                          },
                        data: {
                              labels: this.props.data.map(d => d.time),
                                datasets: [{
                                  label: 'Battery Voltage (mV)',
                                  data: this.props.data.map(d => d.batvoltagemv),
                                  fill: 'rgba(208, 170, 255, 0.75)',
                                  backgroundColor: "rgba(208, 170, 255, 0.75)",
                                  borderColor: "rgba(208, 170, 255, 1)",
                                  pointBackgroundColor: "rgba(208, 170, 255, 1)",
                                  pointRadius: 3,
                                  borderWidth: 1,
                                  lineTension: 0,
                                  yAxisID: 'batAxis',
                                }]
                        }
                    });
    }
}