import React from "react";
import {handleDismiss} from "./BasePage"
import {withRouter } from "react-router-dom";
import {getData, handleErrors} from "./api.js";
import {ConsumerBasePage, ConsumerTagBC} from "./ConsumerPage";
import {ConfigNFC} from "./ConfigNFC";


class ConsumerConfigNFCPage extends React.Component {
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

  render() {
      return (
          <ConsumerBasePage bc={<ConsumerConfigNFC_BC serial={this.props.serial} tagexists={this.state.tag} />}>
            <ConfigNFC tag={this.state.tag} admin={false} />
          </ConsumerBasePage>
      );
  }
}

function ConsumerConfigNFC_BC(props) {
    return (
      <ConsumerTagBC serial={props.serial} tagexists={props.tagexists}>
            <li className="is-active"><a href="#" aria-current="page">Configure</a></li>
      </ConsumerTagBC>
    );
}



export default withRouter(ConsumerConfigNFCPage);