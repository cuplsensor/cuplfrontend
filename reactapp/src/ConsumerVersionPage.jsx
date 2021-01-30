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
import {withRouter } from "react-router-dom";
import {ConsumerBasePage} from "./ConsumerPage";
import {getData, handleErrors} from "./api";


class ConsumerVersionPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {'version': null}
  }

  componentDidMount() {
      getData(process.env.REACT_APP_WSB_ORIGIN + '/api/consumer/version',)
      .then(handleErrors)
      .then(response => response.json())
      .then(json => {
              this.setState({version: json});
              console.log(json);
          },
          (error) => {
              this.setState({error});
          });
  }

  deploy_frontend_backend() {
      const cupldeploy_github_url = process.env.REACT_APP_CUPLDEPLOY_REPO + '/tree/' + process.env.REACT_APP_CUPLDEPLOY_HASH;
      const fb_list = this.frontend_backend();

      return (
        <ul>
          <li>cupldeploy <a href={cupldeploy_github_url}>{process.env.REACT_APP_CUPLDEPLOY_HASH}</a>
              {fb_list}
          </li>
        </ul>
      );
  }

  frontend_backend() {
      const cuplfrontend_github_url = process.env.REACT_APP_CUPLFRONTEND_REPO + '/tree/' + process.env.REACT_APP_CUPLFRONTEND_HASH;
      const cuplbackend_github_url = process.env.REACT_APP_CUPLBACKEND_REPO + '/tree/' + process.env.REACT_APP_CUPLBACKEND_HASH;
      const cuplbackend_url = process.env.REACT_APP_WSB_ORIGIN;
      var cuplbackend_version = "";
      var cuplbackend_version_url = "";
      var cuplcodec_version = "";
      var cuplcodec_version_url = "";
      if (this.state.version) {
          cuplbackend_version = this.state.version['cuplbackend'];
          cuplbackend_version_url = process.env.REACT_APP_CUPLBACKEND_REPO + '/releases/tag/' + cuplbackend_version;
          cuplcodec_version = this.state.version['cuplcodec'];
          cuplcodec_version_url = process.env.REACT_APP_CUPLCODEC_REPO + '/releases/tag/' + cuplcodec_version;
      }
      return (
      <ul>
        <li>cuplfrontend <a href={cuplfrontend_github_url}>{process.env.REACT_APP_CUPLFRONTEND_HASH}</a></li>
        <li><a href={cuplbackend_url}>cuplbackend</a> <a href={cuplbackend_github_url}>{process.env.REACT_APP_CUPLBACKEND_HASH}</a> <i>reports as </i><a href={cuplbackend_version_url}>{cuplbackend_version}</a>
        <ul>
            <li>cuplcodec <a href={cuplcodec_version_url}>{cuplcodec_version}</a></li>
        </ul>
        </li>
      </ul>
      );
  }

  render() {
      var versionlist;
      if (process.env.REACT_APP_CUPLDEPLOY_HASH) {
          versionlist = this.deploy_frontend_backend();
      } else {
          versionlist = this.frontend_backend();
      }

      return (
          <ConsumerBasePage bc={<ConsumerVersionBC />}>
              <div className="content">
                  {versionlist}
              </div>
              <div className="content">
                  <p>Icons by
                      <a href="https://fontawesome.com/"> FontAwesome</a>.
                      Used under the
                      <a href="https://creativecommons.org/licenses/by/4.0/deed.ast"> CC-BY 4.0 licence</a>.
                  </p>
              </div>
          </ConsumerBasePage>
      );
  }
}


function ConsumerVersionBC(props) {
    return (
        <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li className="is-active"><a href="#" aria-current="page">Version</a></li>
        </ul>
      </nav>
    );
}

export default withRouter(ConsumerVersionPage);