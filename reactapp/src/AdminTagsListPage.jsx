import React from "react";
import {AdminPage, AdminMenu, AdminBC, RedirectToLogin} from "./AdminPage"
import {Link, Redirect, withRouter} from "react-router-dom";
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, ErrorMessage} from "./BasePage";
import {Pagination, parsePages} from "./Pagination";
import {postData, getData, handleErrors, GetAdminToken} from "./api";
import {DateTime} from "luxon";
import {AdminResourceTable, ResourceTable} from "./AdminResourceTable";

function TagHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Serial</th>
            <th>Secret Key</th>
            <th>Firmware Version</th>
            <th>Hardware Version</th>
            <th>Description</th>
            <th>Date Created</th>
            <th>Time Created</th>
            <th></th>
        </tr>
    );
}

function TagListItem(props) {
      const dtUTC = DateTime.fromISO(props.resource['timeregistered']).setZone('utc');
      const datestamp = dtUTC.toLocaleString(DateTime.DATE_SHORT);
      const timestamp = dtUTC.toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET);
      return (
        <tr>
            <td><Link to={"/admin/tag/" + props.resource['id']}>{props.resource['id']}</Link></td>
            <td>{props.resource['serial']}</td>
            <td>{props.resource['secretkey']}</td>
            <td>{props.resource['fwversion']}</td>
            <td>{props.resource['hwversion']}</td>
            <td>{props.resource['description']}</td>
            <td>{datestamp}</td>
            <td>{timestamp}</td>
            <td><a href="#" onClick={() => props.deleteFcn(process.env.REACT_APP_WSB_ORIGIN + '/api/admin/tag/' + props.resource['id'])}>Delete</a></td>
        </tr>
      );
  }

  function AdminTagsBC(props) {
    return(
        <AdminBC>
            <li className="is-active"><a href="#" aria-current="page">Tags</a></li>
        </AdminBC>
    );
}

class AdminTagsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
            redirect: false,
    };

    GetAdminToken.call(this);


  }

  render() {
      return(
          <AdminPage bc={<AdminTagsBC />} menu={<AdminMenu activetab='tags' />}>
            <AdminResourceTable
                {...this.props}
                ListItem={TagListItem}
                HeaderItem={TagHeaderItem}
                showAdd={true}
                url={process.env.REACT_APP_WSB_ORIGIN + '/api/admin/tags'}
            />

          </AdminPage>
      );
  }
}

export default withRouter(AdminTagsList);