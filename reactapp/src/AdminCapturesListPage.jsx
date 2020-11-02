import React from "react";
import {AdminPage, AdminMenu, AdminBC} from "./AdminPage"
import {Link, withRouter} from "react-router-dom";
import {AdminResourceTable} from "./AdminResourceTable";
import {DateTime} from "luxon";
import {AdminTagBC} from "./AdminTagPage";

function AdminCapturesBC(props) {
    return(
        <AdminBC>
            <li className="is-active"><a href="#" aria-current="page">Captures</a></li>
        </AdminBC>
    );
}

export function AdminCapturesListPage(props) {
    return(
          <AdminPage bc={<AdminCapturesBC />} menu={<AdminMenu activetab='captures' />}>
            <AdminResourceTable
                {...props}
                ListItem={CapturesListItem}
                HeaderItem={CapturesHeaderItem}
                url={process.env.REACT_APP_WSB_ORIGIN + '/api/admin/captures'}
            />
          </AdminPage>
      );
}

function CapturesHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Parent Tag</th>
            <th>Date Created</th>
            <th>Time Created</th>
        </tr>
        );
}

function CapturesListItem(props) {
      const dtUTC = DateTime.fromISO(props.resource['timestamp']).setZone('utc');
      const datestamp = dtUTC.toLocaleString(DateTime.DATE_SHORT);
      const timestamp = dtUTC.toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET);
      return (
        <tr>
            <td>{props.resource['id']}</td>
            <td><Link to={"/admin/tag/" + props.resource['parent_tag']}>{props.resource['parent_tag']}</Link></td>
            <td>{datestamp}</td>
            <td>{timestamp}</td>
        </tr>
      );
  }

export default withRouter(AdminCapturesListPage);


