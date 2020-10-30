import {AdminTagBC, AdminTagMenu} from "./AdminTagPage";
import {withRouter} from "react-router-dom";
import React from "react";
import {GetAdminToken, getData, handleErrors, putData} from "./api";
import {AdminPage, RedirectToLogin} from "./AdminPage";
import {TagConfigForm} from "./TagConfigForm";
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, Section} from "./BasePage";

class AdminConfigSerialPage extends React.Component {
  constructor(props) {
    super(props);

    GetAdminToken.call(this);

    this.state = {error: false};
  }

  componentDidMount() {
      const admintoken = this.admintoken;
      const tagid = this.props.match.params.id;
      const bearertoken = `Bearer ${admintoken}`;
      getData('https://b3.websensor.io/api/admin/tag/' + tagid,
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


  render() {
      const tagid = this.props.match.params.id;
      const activetab = 'Configure (serial)';
      const error = this.state.error;
      const tag = this.state.tag;
      if (error) {
          if (error.code === 401) {
              return <RedirectToLogin error={error} />
          }
      }
      return (
          <AdminPage bc={<AdminConfigSerialBC tagid={tagid} />} menu={<AdminTagMenu tagid={tagid} activetab={activetab} />}>
              <Section>
                  <TagConfigForm tag={tag} />
              </Section>
          </AdminPage>);

    }
}


function AdminConfigSerialBC(props) {
    return(
        <AdminTagBC tagid={props.tagid}>
            <li className="is-active"><a href="#" aria-current="page">Configure (serial)</a></li>
        </AdminTagBC>
    );
}


export default withRouter(AdminConfigSerialPage);