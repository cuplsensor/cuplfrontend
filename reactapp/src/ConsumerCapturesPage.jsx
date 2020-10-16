import React from "react";
import {Redirect, Link, withRouter } from "react-router-dom";
import {BasePage, BulmaField, BulmaControl, BulmaLabel, BulmaInput, BulmaSubmit, ErrorMessage} from "./BasePage.jsx";
import {getData, handleErrors} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import {ConsumerTagBC} from "./ConsumerTagPage";
import {DateTime} from 'luxon';
import {ResourceTable} from "./AdminResourceTable";



class ConsumerCapturesPage extends React.Component {
  constructor(props) {
    super(props);

    var tag = null;

    if (props.location.state) {
        tag = props.location.state.tag;
    }

    this.state = {'error': false, 'tag': tag};

  }

  componentDidMount() {
      if (this.state.tag == null) {
          getData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial,
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
              <ResourceTable
                    {...this.props}
                    ListItem={CapturesListItem}
                    HeaderItem={CapturesHeaderItem}
                    url={this.state.tag.captures_url}
              />);

      } else {
          return ('');
      }
  }

  render() {
      return (
          <ConsumerBasePage bc={<ConsumerCapturesBC serial={this.props.serial} />}>
              {this.renderTable()}
          </ConsumerBasePage>
      );
  }
}

function ConsumerCapturesBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href={`/tag/${props.serial}`}>{props.serial}</a></li>
            <li className="is-active"><a href="#" aria-current="page">Captures</a></li>
        </ul>
      </nav>
    );
}


function CapturesHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Timestamp (UTC)</th>
        </tr>
        );
}

function CapturesListItem(props) {
      const timestamp = DateTime.fromISO(props.resource['timestamp']).toLocaleString(DateTime.DATETIME_MED);
      return (
        <tr>
            <td><Link to={{pathname: `/tag/${props.resource.tagserial}/captures/${props.resource.id}`, state:{capture:props.resource}}}>{props.resource['id']}</Link></td>
            <td>{timestamp}</td>
        </tr>
      );
  }


export default withRouter(ConsumerCapturesPage);