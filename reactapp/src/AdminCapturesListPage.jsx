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
                url='https://b3.websensor.io/api/admin/captures'
            />
          </AdminPage>
      );
}

function CapturesHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Parent Tag</th>
            <th>Timestamp (UTC)</th>
        </tr>
        );
}

function CapturesListItem(props) {
      const timestamp = DateTime.fromISO(props.resource['timestamp']).toLocaleString(DateTime.DATETIME_MED);
      return (
        <tr>
            <td>{props.resource['id']}</td>
            <td><Link to={"/admin/tag/" + props.resource['parent_tag']}>{props.resource['parent_tag']}</Link></td>
            <td>{timestamp}</td>
        </tr>
      );
  }

export default withRouter(AdminCapturesListPage);


