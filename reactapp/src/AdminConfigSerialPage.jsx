import {AdminTagBC, AdminTagMenu} from "./AdminTagPage";
import {Redirect, withRouter} from "react-router-dom";
import React from "react";
import {GetAdminToken, getData, handleErrors} from "./api";
import {AdminPage, RedirectToLogin} from "./AdminPage";
import {TagConfigForm} from "./TagConfigForm";
import {ConnectAndWrite} from "./webserial";
import {Section, DisplayStatus, ErrorMessage} from "./BasePage";

class AdminConfigSerialPage extends React.Component {
  constructor(props) {
    super(props);

    GetAdminToken.call(this);

    this.state = {error: false, writestatus: null, write_error: false, write_success: false};

    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.handleWriteClick = this.handleWriteClick.bind(this);
  }

  componentDidMount() {
      const admintoken = this.admintoken;
      const tagid = this.props.match.params.id;
      const bearertoken = `Bearer ${admintoken}`;
      getData(process.env.REACT_APP_WSB_ORIGIN + '/api/admin/tag/' + tagid,
        {'Authorization': bearertoken }
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({
              tag: json,
            });
        },
        (error) => {
          this.setState({error});
        });
  }

  handleConfigChange(configlist) {
      this.setState({configlist: configlist});
  }

  handleWriteClick(event) {
      event.preventDefault();
      this.setState({writestatus: "Writing configuration strings...", write_error: false, write_success: false});
      ConnectAndWrite(this.state.configlist)
        .then(function displayStatus(status) {
                this.setState({writestatus: status, write_error: false, write_success: true});
              }.bind(this))
          .catch(error => {
                console.log(error);
                this.setState({writestatus: error, write_error: true, write_success: false});
              });
  }

  render() {
      const tagid = this.props.match.params.id;
      const activetab = 'Serial';
      const error = this.state.error;
      const tag = this.state.tag;
      var configlistcr = "";
      if (error) {
          if (error.code === 401) {
              return <RedirectToLogin error={error} />
          }
          if (error.code === 404) {
                return <Redirect to={{
            pathname: `/admin/tags`,
            state: {error: error}}} />
          }
      }
      if (this.state.configlist) {
          configlistcr = this.state.configlist.map((item, index) => <p key={index}>{item}</p>);
      }
      return (
          <AdminPage bc={<AdminConfigSerialBC tagid={tagid} />} menu={<AdminTagMenu tagid={tagid} activetab={activetab} />}>
              <Section>
                  <ErrorMessage error={error} />
                  <TagConfigForm tag={tag} onConfigChange={this.handleConfigChange} admin={true}/>
                  <div className="block">
                      <pre>
                          <code>
                              {configlistcr}
                          </code>
                      </pre>
                  </div>
                  <div className="columns is-vcentered">
                      <div className="column is-narrow">
                        <button onClick={this.handleWriteClick} className="button is-info is-light">Write to Tag</button>
                      </div>
                      <div className="column">
                          <DisplayStatus err={this.state.write_error} success={this.state.write_success} status={this.state.writestatus} />
                      </div>
                  </div>
              </Section>
          </AdminPage>);

    }
}

function AdminConfigSerialBC(props) {
    return(
        <AdminTagBC tagid={props.tagid}>
            <li className="is-active"><a href="#" aria-current="page">Configure</a></li>
            <li className="is-active"><a href="#" aria-current="page">Serial</a></li>
        </AdminTagBC>
    );
}


export default withRouter(AdminConfigSerialPage);