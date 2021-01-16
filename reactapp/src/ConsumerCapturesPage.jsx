import React from "react";
import {handleDismiss} from "./BasePage"
import {Link, withRouter } from "react-router-dom";
import {TagErrorMessage} from "./BasePage.jsx";
import {getData, handleErrors} from "./api.js";
import {ConsumerBasePage, ConsumerTagBC} from "./ConsumerPage";
import {DateTime} from 'luxon';
import {ResourceTable} from "./AdminResourceTable";


class ConsumerCapturesPage extends React.Component {
  constructor(props) {
    super(props);

    var tag = null;

    if (props.location.state) {
        tag = props.location.state.tag;
    }

    this.handleDismiss = handleDismiss.bind(this);
    this.state = {'error': false, 'tag': tag};

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
              <ResourceTable
                    {...this.props}
                    ListItem={CapturesListItem}
                    HeaderItem={CapturesHeaderItem}
                    url={this.state.tag.captures_url}
              />);

      } else {
          return (<TagErrorMessage error={this.state.error} serial={this.props.serial} handleDismiss={this.handleDismiss} />);
      }
  }

  render() {
      return (
          <ConsumerBasePage bc={<ConsumerCapturesBC serial={this.props.serial} tagexists={this.state.tag} />}>
              {this.renderTable()}
          </ConsumerBasePage>
      );
  }
}

function ConsumerCapturesBC(props) {
    return (
      <ConsumerTagBC serial={props.serial} tagexists={props.tagexists}>
            <li className="is-active"><a href="#" aria-current="page">Captures</a></li>
      </ConsumerTagBC>
    );
}


function CapturesHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Timestamp</th>
        </tr>
        );
}

function CapturesListItem(props) {
    const timestamp = DateTime.fromISO(props.resource['timestamp']).toLocaleString(DateTime.DATETIME_FULL);
      return (
        <tr>
            <td><Link to={{pathname: `/tag/${props.resource.tagserial}/captures/${props.resource.id}`, state:{capture:props.resource}}}>{props.resource['id']}</Link></td>
            <td>{timestamp}</td>
        </tr>
      );
  }


export default withRouter(ConsumerCapturesPage);