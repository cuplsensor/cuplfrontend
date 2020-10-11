import React from "react";
import {Redirect, withRouter } from "react-router-dom";
import {getData, handleErrors} from "./api.js";



class ConsumerRandomTagPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {'error': false, 'serial': ''};
  }

  componentDidMount() {
    getData('https://b3.websensor.io/api/consumer/random/tag',
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({serial: json['serial']})
        },
        (error) => {
          this.setState({error: error});
        });
  }

  render() {
      const error = this.state.error;

      if (this.state.serial) {
          return(
            <Redirect to={"/tag/" + this.state.serial} />
          );
      }
      return ('');
  }
}


export default withRouter(ConsumerRandomTagPage);