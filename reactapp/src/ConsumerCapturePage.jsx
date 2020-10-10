import React from "react";
import {Redirect, Link, withRouter } from "react-router-dom";
import {BasePage, BulmaField, BulmaControl, BulmaLabel, BulmaInput, BulmaSubmit, ErrorMessage} from "./BasePage.jsx";
import {getData, postData} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {ConsumerTagBC} from "./ConsumerTagPage";
import {DateTime} from 'luxon';
import {Chart} from 'chart.js';
import 'chartjs-adapter-luxon';



class ConsumerCapturePage extends React.Component {
  constructor(props) {
    super(props);

    var capture = null;

    if (props.location.state) {
        capture = props.location.state.capture;
    }

    this.state = {'error': false, 'capture': capture, 'chartsamples': []};
  }



  renderChart() {
      var chartsamples = [];
      for (const sample of this.state.samples) {
          chartsamples.push({'time': DateTime.fromISO(sample['timestamp']), 'value': sample['temp']});
      }
      this.setState({chartsamples: chartsamples});
  }

  getCaptureSamples(samples_url) {
      getData(samples_url,
          {},
          {page: 1, per_page: 100}
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({samples: json});
            this.renderChart();
        },
        (error) => {
          this.setState({error});
        });
  }

  componentDidMount() {
      if (this.state.capture == null) {
        getData('https://b3.websensor.io/api/consumer/captures/' + this.props.id,
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({capture: json})
            this.getCaptureSamples(this.state.capture.samples_url);
        },
        (error) => {
          this.setState({error});
        });
      } else {
          this.getCaptureSamples(this.state.capture.samples_url);
      }
  }

  render() {
      const error = this.state.error;
      var tagserial = "";

      var capture_id = "";

      if (this.state.capture) {
          tagserial = this.state.capture.tagserial;
          capture_id = this.state.capture.id;
      }

      return (
          <ConsumerBasePage bc={<ConsumerCaptureBC serial={tagserial} capture_id={capture_id} />}>
              <div id="chart-container">
                  <LineChart data={this.state.chartsamples} color="rgba(220,100,94,1)" title="temperature"/>
              </div>

          </ConsumerBasePage>
      );
  }
}

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidUpdate() {
        this.myChart.data.labels = this.props.data.map(d => d.time);
        this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
        this.myChart.update();
    }

    componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
                          type: 'line',
                          options: {
                            scales: {
                              xAxes: [
                                {
                                  type: 'time',
                                  time: {
                                    unit: 'week'
                                  }
                                }
                              ],
                              yAxes: [
                                {
                                  ticks: {
                                    min: 0
                                  }
                                }
                              ]
                            }
                          },
                        data: {
                              labels: this.props.data.map(d => d.time),
                                datasets: [{
                                  label: this.props.title,
                                  data: this.props.data.map(d => d.value),
                                  fill: 'none',
                                  backgroundColor: this.props.color,
                                  pointRadius: 3,
                                  borderColor: this.props.color,
                                  borderWidth: 1,
                                  lineTension: 0,
                                  yAxesID: "id1"
                                },
                                {
                                  label: this.props.title,
                                  data: this.props.data.map(d => d.value),
                                  fill: 'none',
                                  backgroundColor: this.props.color,
                                  pointRadius: 3,
                                  borderColor: this.props.color,
                                  borderWidth: 1,
                                  lineTension: 0,
                                  yAxesID: "id2"
                                }]
                        }
                    });
    }

    render() {
        return <canvas ref={this.chartRef} />;
    }
}

function ConsumerCaptureBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href={`/tag/${props.serial}`}>{props.serial}</a></li>
            <li><a href={`/tag/${props.serial}/captures/`}>Captures</a></li>
            <li className="is-active"><a href="#" aria-current="page">{props.capture_id}</a></li>
        </ul>
      </nav>
    );
}





export default withRouter(ConsumerCapturePage);