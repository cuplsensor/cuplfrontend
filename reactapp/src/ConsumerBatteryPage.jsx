import React from "react";
import {handleDismiss} from "./BasePage"
import {Redirect, Link, withRouter } from "react-router-dom";
import {
    BasePage,
    BulmaField,
    BulmaControl,
    BulmaLabel,
    BulmaInput,
    BulmaSubmit,
    ErrorMessage,
    TagErrorMessage
} from "./BasePage.jsx";
import {getData, handleErrors} from "./api.js";
import {ConsumerBasePage, ConsumerTagBC} from "./ConsumerPage";
import {BatteryLineChart} from "./LineChart";
import {DateTime} from 'luxon';
import {ResourceTable} from "./AdminResourceTable";



class ConsumerBatteryPage extends React.Component {
  constructor(props) {
    super(props);

    var tag = null;

    if (props.location.state) {
        tag = props.location.state.tag;
    }

    this.handleDismiss = handleDismiss.bind(this);
    this.state = {'error': false, 'tag': tag, 'captures':[], 'hideTable': true};
    this.onCapturesChange = this.onCapturesChange.bind(this);
    this.toggleTable = this.toggleTable.bind(this);
  }

  onCapturesChange(captures) {
      // Add timestamp here.
      const captureswithtime = captures.map(function(el) {
          var o = Object.assign({}, el);
          o.time = DateTime.fromISO(el['timestamp'], {zone: 'utc'}).setZone('local');
          return o;
        });
      this.setState({captures: captureswithtime});
  }

  componentDidMount() {
      if (this.state.tag == null) {
          getData(process.env.REACT_APP_WSB_ORIGIN + '/api/consumer/tag/' + this.props.serial,
          )
              .then(handleErrors)
              .then(response => response.json())
              .then(json => {
                      this.setState({tag: json});
                  },
                  (error) => {
                      this.setState({error});
                  });
      }
  }

  renderTable() {
      if (this.state.tag) {
          return(
              <div>
                  <div id="chart-container">
                    <BatteryLineChart data={this.state.captures} />
                  </div>
                  <section className="section">
                      <div className="container pb-4">
                      {this.tableSwitch()}
                      </div>
                      <div className="container">
                          <ResourceTable
                                {...this.props}
                                ListItem={BatteryListItem}
                                HeaderItem={BatteryHeaderItem}
                                url={this.state.tag.captures_url}
                                per_page={25}
                                hideTable={this.state.hideTable}
                                resourceChangeCallback={this.onCapturesChange}
                          />
                      </div>
                  </section>
                  </div>);

      } else {
          return (<TagErrorMessage error={this.state.error} serial={this.props.serial} handleDismiss={this.handleDismiss} />);
      }
  }

  toggleTable() {
      this.setState({hideTable: !this.state.hideTable});
  }

  tableSwitch() {
      if (this.state.hideTable) {
          return(
            <a href='#' onClick={this.toggleTable}>Show table</a>
          );
      } else {
          return(
            <a href='#' onClick={this.toggleTable}>Hide table</a>
          );
      }
  }

  render() {
      return (
          <ConsumerBasePage bc={<ConsumerBatteryBC serial={this.props.serial} tagexists={this.state.tag} />}>

              {this.renderTable()}
          </ConsumerBasePage>
      );
  }
}

function ConsumerBatteryBC(props) {
    return (
      <ConsumerTagBC serial={props.serial} tagexists={props.tagexists}>
            <li className="is-active"><a href="#" aria-current="page">Battery</a></li>
      </ConsumerTagBC>
    );
}


function BatteryHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Battery (mV)</th>
        </tr>
        );
}

function BatteryListItem(props) {
    const timestamp = DateTime.fromISO(props.resource['timestamp']).toLocaleString(DateTime.DATETIME_FULL);
      return (
        <tr>
            <td><Link to={{pathname: `/tag/${props.resource.tagserial}/captures/${props.resource.id}`, state:{capture:props.resource}}}>{props.resource['id']}</Link></td>
            <td>{timestamp}</td>
            <td>{props.resource['batvoltagemv']}</td>
        </tr>
      );
  }


export default withRouter(ConsumerBatteryPage);