import {AdminTagBC, AdminTagMenu} from "./AdminTagPage";
import {useLocation, withRouter} from "react-router-dom";
import React from "react";
import {GetAdminToken, getData, handleErrors, putData} from "./api";
import {AdminPage, RedirectToLogin} from "./AdminPage";
import {TagConfigForm} from "./TagConfigForm";
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, Section} from "./BasePage";
import {ConsumerBasePage} from "./ConsumerPage";
import {ConfigNFC} from "./ConfigNFC";

class AdminConfigNFCPage extends React.Component {
  constructor(props) {
    super(props);

    GetAdminToken.call(this);

    this.state = {error: false};
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

  render() {
      const tagid = this.props.match.params.id;
      const activetab = 'NFC';
      const error = this.state.error;
      const tag = this.state.tag;

      if (error) {
          if (error.code === 401) {
              return <RedirectToLogin error={error} />
          }
      }

      return (
          <AdminPage bc={<AdminConfigNFC_BC tagid={tagid} />} menu={<AdminTagMenu tagid={tagid} activetab={activetab} />}>
              <Section>
                    <ConfigNFC tag={this.state.tag} admin={true} />
              </Section>
          </AdminPage>);

    }
}


function AdminConfigNFC_BC(props) {
    return(
        <AdminTagBC tagid={props.tagid}>
            <li className="is-active"><a href="#" aria-current="page">Configure</a></li>
            <li className="is-active"><a href="#" aria-current="page">NFC</a></li>
        </AdminTagBC>
    );
}


export default withRouter(AdminConfigNFCPage);