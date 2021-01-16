import {GetAdminToken, handleErrors, postData} from "./api";
import {AdminBC, AdminMenu, AdminPage, RedirectToLogin} from "./AdminPage";
import {
    BulmaControl,
    Section,
    BulmaLabel,
    BulmaInput,
    BulmaField,
    BulmaSubmit, ErrorMessage
} from "./BasePage";
import React from "react";
import {Redirect, withRouter} from "react-router-dom";
import {ConnectAndGetVersion} from "./webserial";

class AdminTagsAddPage extends React.Component {
  constructor(props) {
    super(props);

    GetAdminToken.call(this);

    this.state = {serial: null, secretkey: null, description: null, fwversion: null, hwversion: null, newtag: null, readstatus: ""};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReadClick = this.handleReadClick.bind(this);
  }

  handleSubmit(event) {
      const admintoken = this.admintoken;
      const bearertoken = `Bearer ${admintoken}`;
      const extraheaders = {'Authorization': bearertoken};
      var payload = {};

      if (this.state.serial) {
          payload.serial = this.state.serial;
      }

      if (this.state.secretkey) {
          payload.secretkey = this.state.secretkey;
      }

      if (this.state.description) {
          payload.description = this.state.description;
      }

      if (this.state.fwversion) {
          payload.fwversion = this.state.fwversion;
      }

      if (this.state.hwversion) {
          payload.hwversion = this.state.hwversion;
      }

      if (event) {
          event.preventDefault();
      }

      postData(process.env.REACT_APP_WSB_ORIGIN + '/api/admin/tags',
        payload,
        extraheaders)
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({newtag: json});
        },
        (error) => {
            if (error) {
                this.setState({error: error});
            }
        });
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleReadClick(event) {
      event.preventDefault();
      this.setState({readstatus: "Reading version..."});
      ConnectAndGetVersion()
          .then(function processVersion(fwversion) {
                console.log(fwversion);
                this.setState({readstatus: "Read OK", fwversion: fwversion});
              }.bind(this))
          .catch(error => {
                console.log(error);
                this.setState({readstatus: error});
              });
  }

  render() {
      const activetab = 'Add';
      const error = this.state.error;
      if (this.state.newtag) {
          return <Redirect to={{
              pathname: `/admin/tag/${this.state.newtag['id']}/configure`,
              state: {error: error}}}
          />
      }
      if (error) {
          if (error.code ===401) {
              return <RedirectToLogin error={error} />
          }
      }
      return (
          <AdminPage bc={<AdminTagsAddBC />} menu={<AdminMenu activetab={activetab} />}>
            <ErrorMessage error={error} handleDismiss={this.handleDismiss} />
            <Section>
              <form onSubmit={this.handleSubmit} autoComplete="off">
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Serial</BulmaLabel>
                              <BulmaInput id="serial" type="text" value={this.state.serial || ""} changeHandler={this.handleChange} maxLength={8}/>
                          </BulmaControl>
                      </BulmaField>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Secret Key</BulmaLabel>
                              <BulmaInput id="secretkey" type="text"  value={this.state.secretkey || ""} changeHandler={this.handleChange} maxLength={16}/>
                          </BulmaControl>
                      </BulmaField>
                      <div className="field is-grouped">
                          <div className="control is-expanded">
                              <BulmaLabel>Firmware Version</BulmaLabel>
                              <BulmaInput id="fwversion" type="text" value={this.state.fwversion || ""} changeHandler={this.handleChange}/>
                          </div>
                          <BulmaControl>
                              <BulmaLabel>&#8205;</BulmaLabel>
                              <button className="button is-primary is-link is-light" onClick={this.handleReadClick}>Read from Serial</button>
                          </BulmaControl>
                      </div>
                      <div className="notification" id="serialstatus" style={{display: this.state.readstatus === "" ? 'None' : 'block'}}>
                          {this.state.readstatus}
                      </div>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Hardware Version</BulmaLabel>
                              <BulmaInput id="hwversion" type="text" value={this.state.hwversion || ""} changeHandler={this.handleChange } />
                          </BulmaControl>
                      </BulmaField>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Description</BulmaLabel>
                              <BulmaInput id="description" type="text" value={this.state.description || ""} changeHandler={this.handleChange} />
                          </BulmaControl>
                      </BulmaField>
                      <BulmaSubmit/>
                      {/* https://jsfiddle.net/ndebellas/y4dLcqkx/ */}
              </form>
              </Section>
          </AdminPage>);

    }
}

function AdminTagsAddBC(props) {
    return(
        <AdminBC>
            <li><a href="/admin/tags" aria-current="page">Tags</a></li>
            <li className="is-active"><a href="#" aria-current="page">Add</a></li>
        </AdminBC>
    );
}


export default withRouter(AdminTagsAddPage);