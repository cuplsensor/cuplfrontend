import React from "react";
import {AdminPage} from "./AdminPage"
import {AdminTagBC, AdminTagMenu} from "./AdminTagPage"
import {withRouter} from "react-router-dom";
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
                extraparams={{'tag_id': tagid}}
                url={process.env.REACT_APP_WSB_ORIGIN + '/api/admin/captures'}
            />
          </AdminPage>
      );
}

function TagCapturesHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Date Created</th>
            <th>Time Created</th>
            <th></th>
        </tr>
        );
}

function TagCapturesListItem(props) {
    const dtUTC = DateTime.fromISO(props.resource['timestamp']).setZone('utc');
    const datestamp = dtUTC.toLocaleString(DateTime.DATE_SHORT);
    const timestamp = dtUTC.toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET);
      return (
        <tr>
            <td>{props.resource['id']}</td>
            <td>{datestamp}</td>
            <td>{timestamp}</td>
            <td><a href="#" onClick={() => props.deleteFcn(process.env.REACT_APP_WSB_ORIGIN + '/api/admin/capture/' + props.resource['id'])}>Delete</a></td>
        </tr>
      );
  }


export default withRouter(AdminTagCapturesPage);


