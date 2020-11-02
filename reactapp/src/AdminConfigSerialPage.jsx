import {AdminTagBC, AdminTagMenu} from "./AdminTagPage";
import {withRouter} from "react-router-dom";
import React from "react";
import {GetAdminToken, getData, handleErrors, putData} from "./api";
import {AdminPage, RedirectToLogin} from "./AdminPage";
import {TagConfigForm} from "./TagConfigForm";
import {ConnectAndWrite} from "./webserial";
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, Section} from "./BasePage";

class AdminConfigSerialPage extends React.Component {
  constructor(props) {
    super(props);

    GetAdminToken.call(this);

    this.state = {error: false};

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

  handleWriteClick() {
      ConnectAndWrite(this.state.configlist);
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
      }
      if (this.state.configlist) {
          configlistcr = this.state.configlist.map((item, index) => <p key={index}>{item}</p>);
      }
      return (
          <AdminPage bc={<AdminConfigSerialBC tagid={tagid} />} menu={<AdminTagMenu tagid={tagid} activetab={activetab} />}>
              <Section>
                  <TagConfigForm tag={tag} onConfigChange={this.handleConfigChange} />
                  <div className="block">
                      <pre>
                          <code>
                              {configlistcr}
                          </code>
                      </pre>
                  </div>
                  <div className="block">
                      <button onClick={this.handleWriteClick} className="button">Write to Serial</button>
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