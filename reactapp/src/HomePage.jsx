/*
 * Copyright (c) 2021. Plotsensor Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import {Redirect, withRouter} from "react-router-dom";
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
              if (error.code === 409) {
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
            <section className="section pl-3">
                <div className="container">
                    <p>cu<sub>pl</sub> the NFC environmental sensor: <a href="https://cupl.co.uk" style={{color: "red"}}>learn more and buy cuplTags &#xbb;</a></p>
                </div>
            </section>
          </ConsumerBasePage>
      );
  }
}

export default withRouter(HomePage);