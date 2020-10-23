import React from "react";
import {AdminPage, AdminMenu, AdminBC, RedirectToLogin} from "./AdminPage"
import {Link, Redirect, withRouter} from "react-router-dom";
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, ErrorMessage} from "./BasePage";
import {Pagination, parsePages} from "./Pagination";
import {postData, getData, handleErrors, GetAdminToken} from "./api";
import {DateTime} from "luxon";
import {AdminResourceTable} from "./AdminResourceTable";

function TagHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Serial</th>
            <th>Secret Key</th>
            <th>Firmware Version</th>
            <th>Hardware Version</th>
            <th>Description</th>
            <th>Created On (UTC)</th>
        </tr>
    );
}

function TagListItem(props) {
      const timestamp = DateTime.fromISO(props.resource['timeregistered']).toLocaleString(DateTime.DATETIME_MED);
      return (
        <tr>
            <td><Link to={"/admin/tag/" + props.resource['id']}>{props.resource['id']}</Link></td>
            <td>{props.resource['serial']}</td>
            <td>{props.resource['secretkey']}</td>
            <td>{props.resource['fwversion']}</td>
            <td>{props.resource['hwversion']}</td>
            <td>{props.resource['description']}</td>
            <td>{timestamp}</td>
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
      const bearertoken = `Bearer ${this.admintoken}`;
      postData('https://b3.websensor.io/api/admin/tags',
        {},
        {'Authorization': bearertoken })
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.componentDidMount();
        },
        (error) => {
          this.setState({error: error});
        });
    event.preventDefault();
  }

  render() {
      const error = this.state.error;
      if (error) {
          if (error.code ===401) {
              return <RedirectToLogin error={error} />
          }
      }

      return(
          <AdminPage bc={<AdminTagsBC />} menu={<AdminMenu activetab='tags' />}>
            <AdminResourceTable
                {...this.props}
                ListItem={TagListItem}
                HeaderItem={TagHeaderItem}
                url='https://b3.websensor.io/api/admin/tags'
            />
            <br/>
            <form onSubmit={this.handleSubmit}>
                <BulmaField>
                  <BulmaControl>
                    <BulmaSubmit value="Quick Add" />
                  </BulmaControl>
                </BulmaField>
            </form>
          </AdminPage>
      );
  }
}

export default withRouter(AdminTagsList);