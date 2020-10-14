import React from "react";
import {DateTime} from "luxon";
import {Chart} from "chart.js";
import 'chartjs-adapter-luxon';

export class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.DateTime = DateTime;
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
        this.myChart.data.datasets[0].data = this.props.data.map(d => d.temp);
        this.myChart.data.datasets[1].data = this.props.data.map(d => d.rh);
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
        this.myChart = new Chart(this.chartRef.current, {
                          type: 'line',
                          options: {
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
                                    id: 'tempAxis',
                                    type: 'linear',
                                    position: 'left',
                                }, {
                                    id: 'rhAxis',
                                    type: 'linear',
                                    position: 'right',
                                    display: true
                                }],
                            }
                          },
                        data: {
                              labels: this.props.data.map(d => d.time),
                                datasets: [{
                                  label: this.props.temptitle,
                                  data: this.props.data.map(d => d.temp),
                                  fill: 'none',
                                  backgroundColor: this.props.tempcolor,
                                  pointRadius: 3,
                                  borderColor: this.props.tempcolor,
                                  borderWidth: 1,
                                  lineTension: 0,
                                  yAxisID: 'tempAxis',
                                },
                                {
                                  label: this.props.rhtitle,
                                  data: this.props.data.map(d => d.rh),
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