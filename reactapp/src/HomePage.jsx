import React from "react";
import {Redirect, withRouter } from "react-router-dom";
import {postData, handleErrors, setCookie} from "./api.js";
import {RecentStarred} from "./RecentStarred";
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
      console.log(circbufb64);

      if (serial && statusb64 && timeintb64 && vfmtb64) {
          this.setState({loading: true, serial: serial});
          postData(process.env.REACT_APP_WSB_ORIGIN + '/api/consumer/captures',
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
                setCookie('tagtoken_'+json['tagserial'], json['tagtoken'], 9);
                this.setState({capture: json})
            },
            (error) => {
              if (error.code ===409) {
                  error.message += " a new capture cannot be identical to a previous one."
              }
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
              return <Redirect to={{pathname: "/tag/"+tagserial}} />
          }
      }
      if (error) {
          const tagserial = this.state.serial;
          if (tagserial !== undefined) {
              return <Redirect to={{pathname: "/tag/"+tagserial, state: {error: this.state.error}}} />
          }
      }
      if (loading) {
       return (
          <ConsumerBasePage>Loading...</ConsumerBasePage>
        );
      }

      return (
          <ConsumerBasePage>
            <RecentStarred />
          </ConsumerBasePage>
      );
  }
}

export default withRouter(HomePage);