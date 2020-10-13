import React from "react";
import {Redirect, withRouter } from "react-router-dom";
import {BasePage, BulmaField, BulmaControl, BulmaLabel, BulmaInput, BulmaSubmit, ErrorMessage} from "./BasePage.jsx";
import {getData, postData, handleErrors} from "./api.js";
import Cookies from 'universal-cookie';
import {ConsumerBasePage} from "./ConsumerPage";



class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {client_id: '', client_secret: '', redirect: false, capture: false};
  }

  componentDidMount() {
      const urlparams = new URLSearchParams(this.props.location.search);
      const serial = urlparams.get('s');
      const statusb64 = urlparams.get('x');
      const timeintb64 = urlparams.get('t');
      const circbufb64 = urlparams.get('q');
      const vfmtb64 = urlparams.get('v');

      if (serial && statusb64 && timeintb64 && circbufb64 && vfmtb64) {
          this.setState({loading: true});
          postData('https://b3.websensor.io/api/consumer/captures',
            {'serial': serial,
                  'statusb64': statusb64,
                  'timeintb64': timeintb64,
                  'circbufb64': circbufb64,
                  'vfmtb64': vfmtb64
                }
            )
            .then(handleErrors)
            .then(response => response.json())
            .then(json => {
                this.setState({capture: json})
            },
            (error) => {
              this.setState({error: error});
            });
      }
  }



  render() {
      const error = this.state.error;
      const capture = this.state.capture;
      const loading = this.state.loading;
      if (capture) {
          const tagserial = capture['tagserial'];
          if (tagserial !== undefined) {
              return <Redirect to={"/tag/"+tagserial} />
          }
      }
      if (loading) {
       return (
          <ConsumerBasePage>Loading...</ConsumerBasePage>
        );
      }

      return (
          <ConsumerBasePage>a</ConsumerBasePage>
      );
  }
}

export default withRouter(HomePage);