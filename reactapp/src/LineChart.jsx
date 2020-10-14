import React from "react";
import {DateTime} from "luxon";
import {Chart} from "chart.js";
import 'chartjs-adapter-luxon';

export class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.ticksCallback = this.ticksCallback.bind(this);
        this.parserCallback = this.parserCallback.bind(this);
        this.DateTime = DateTime;
    }

    componentDidUpdate() {
        const xmin = this.props.xmin || null;
        const xmax = this.props.xmax || null;
        console.log(typeof(xmin));
        console.log(xmin);
        if (xmin !== null) {
            this.myChart.options.scales.xAxes[0].ticks.min = xmin;
            //this.myChart.options.scales.xAxes[0].ticks.max = xmax;
        }

        this.myChart.data.labels = this.props.data.map(d => d.time);
        this.myChart.data.datasets[0].data = this.props.data.map(d => d.temp);
        this.myChart.data.datasets[1].data = this.props.data.map(d => d.rh);
        this.myChart.update();
    }

    parserCallback

    ticksCallback(value, index, values) {
        if (values.length > 0) {
          return values[index]['value'];
        }
        else {
          return value;
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
                                    unit: 'hour',
                                    parser: function (dateTimeIn) {
                                        // An unfortunate hack to get around the fact that Chart.JS with the Luxon adapter
                                        // always uses the local timezone to format ticks and tooltips and not the supplied zone
                                        // data from Luxon. This might be fixed time Chart.JS 3.
                                        // What this does is change the underlying timestamp, whilst simultaenously changing the zone
                                        // to ensure that the displayed local time does not change.
                                        return dateTimeIn.setZone('local', { keepLocalTime: true });
                                    }
                                  },
                                  ticks: {
                                      // Create scientific notation labels
                                      callback: function(value, index, values) {
                                        return this.ticksCallback(value, index, values).bind(this);
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