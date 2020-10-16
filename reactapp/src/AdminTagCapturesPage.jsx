import React from "react";
import {AdminPage, RedirectToLogin} from "./AdminPage"
import {AdminTagBC, AdminTagMenu} from "./AdminTagPage"
import {Link, withRouter} from "react-router-dom";
import {AdminResourceTable} from "./AdminResourceTable";
import {DateTime} from "luxon";

function AdminTagCapturesBC(props) {
    return(
        <AdminTagBC tagid={props.tagid}>
            <li className="is-active"><a href="#" aria-current="page">Captures</a></li>
        </AdminTagBC>
    );
}

export function AdminTagCapturesPage(props) {
    const tagid = props.match.params.id;
    const activetab = 'captures';
    return(
          <AdminPage bc={<AdminTagCapturesBC tagid={tagid} />} menu={<AdminTagMenu tagid={tagid} activetab={activetab} />}>
            <AdminResourceTable
                {...props}
                ListItem={TagCapturesListItem}
                HeaderItem={TagCapturesHeaderItem}
                url='https://b3.websensor.io/api/admin/captures'
            />
          </AdminPage>
      );
}

function TagCapturesHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Timestamp (UTC)</th>
        </tr>
        );
}

function TagCapturesListItem(props) {
      const timestamp = DateTime.fromISO(props.resource['timestamp']).toLocaleString(DateTime.DATETIME_MED);
      return (
        <tr>
            <td>{props.resource['id']}</td>
            <td>{timestamp}</td>
        </tr>
      );
  }


export default withRouter(AdminTagCapturesPage);


