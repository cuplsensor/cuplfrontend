import React from "react";
import {AdminPage, AdminMenu, AdminBC} from "./AdminPage"
import {Link, withRouter} from "react-router-dom";
import {AdminResourceTable} from "./AdminResourceTable";
import {DateTime} from "luxon";

function AdminWebhooksBC(props) {
    return(
        <AdminBC>
            <li className="is-active"><a href="#" aria-current="page">Webhooks</a></li>
        </AdminBC>
    );
}

export function AdminWebhooksListPage(props) {
    return(
          <AdminPage bc={<AdminWebhooksBC />} menu={<AdminMenu activetab='webhooks' />}>
            <AdminResourceTable
                {...props}
                ListItem={WebhooksListItem}
                HeaderItem={WebhooksHeaderItem}
                url={process.env.REACT_APP_WSB_ORIGIN + '/api/admin/webhooks'}
            />
          </AdminPage>
      );
}

function WebhooksHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Parent Tag</th>
            <th>Address</th>
            <th>Fields</th>
            <th>WH_Secretkey</th>
            <th>Created On (UTC)</th>
            <th></th>
        </tr>
        );
}

function WebhooksListItem(props) {
    const timestamp = DateTime.fromISO(props.resource['created_on']).setZone('utc').toLocaleString(DateTime.DATETIME_FULL);
      return (
        <tr>
            <td><Link to={"/admin/tag/" + props.resource['tag_id'] + "/webhook"}>{props.resource['id']}</Link></td>
            <td><Link to={"/admin/tag/" + props.resource['tag_id']}>{props.resource['tag_id']}</Link></td>
            <td><a href={props.resource['address']}>{props.resource['address']}</a></td>
            <td>{props.resource['fields']}</td>
            <td>{props.resource['wh_secretkey']}</td>
            <td>{timestamp}</td>
            <td><a href="#" onClick={() => props.deleteFcn(process.env.REACT_APP_WSB_ORIGIN + '/api/admin/webhook/' + props.resource['id'])}>Delete</a></td>
        </tr>
      );
  }

export default withRouter(AdminWebhooksListPage);


