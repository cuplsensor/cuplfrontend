import React from "react";
import {withRouter } from "react-router-dom";
import {getAllData, getData, handleErrors} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
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




  async getCaptureSamples(samples_url) {
      const samples = await getAllData(samples_url,
          {},
          50
      );

      // Add timestamp here.
      for (const sample of samples) {

      }

      const sampleswithtime = samples.map(function(el) {
          var o = Object.assign({}, el);
          o.time = DateTime.fromISO(el['timestamp'], {zone: 'utc'});
          return o;
        });


      sampleswithtime.sort(function(a, b) {
          var keyA = a.time,
            keyB = b.time;
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

      return new Promise(resolve => {resolve(sampleswithtime)});
  }

  componentDidMount() {

      if (this.state.capture == null) {
        getData('https://b3.websensor.io/api/consumer/captures/' + this.props.id,
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({capture: json})
            this.getCaptureSamples(this.state.capture.samples_url)
                .then((samples) => {
                  this.setState({'chartsamples': samples});
              });
        },
        (error) => {
          this.setState({error});
        });
      } else {
          this.getCaptureSamples(this.state.capture.samples_url)
              .then((samples) => {
                  this.setState({'chartsamples': samples});
              });
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
                  <LineChart data={this.state.chartsamples} tempcolor="rgba(220,100,94,1)" temptitle="temperature"
                  rhcolor="rgba(153,226,255,1)" rhtitle="RH"/>
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
        this.myChart.data.datasets[0].data = this.props.data.map(d => d.temp);
        this.myChart.data.datasets[1].data = this.props.data.map(d => d.rh);
        this.myChart.update();
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
                                    unit: 'week'
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