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
      getData(process.env.REACT_APP_WSB_ORIGIN + 'api/consumer/version',)
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