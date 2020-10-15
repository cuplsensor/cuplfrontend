import React from "react";
import {AdminPage, AdminMenu, AdminBC, RedirectToLogin} from "./AdminPage"
import {Link, Redirect, withRouter} from "react-router-dom";
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, ErrorMessage} from "./BasePage";
import {Pagination, parsePages} from "./Pagination";
import {postData, getData, handleErrors, GetAdminToken} from "./api";
import {DateTime} from "luxon";


function TagListItem(props) {
      const timestamp = DateTime.fromISO(props.tag['timeregistered']).toLocaleString(DateTime.DATETIME_MED);
      return (
        <tr>
            <td><Link to={"/admin/tag/" + props.tag['id']}>{props.tag['id']}</Link></td>
            <td>{props.tag['serial']}</td>
            <td>{props.tag['secretkey']}</td>
            <td>{props.tag['fwversion']}</td>
            <td>{props.tag['hwversion']}</td>
            <td>{timestamp}</td>
        </tr>
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
    this.parsePages = parsePages.bind(this);
  }

  componentDidMount() {
      const page = new URLSearchParams(this.props.location.search).get("page") || 1;
      const bearertoken = `Bearer ${this.admintoken}`;
      getData('https://b3.websensor.io/api/admin/tags',
        {'Authorization': bearertoken},
          {'per_page': 10, 'page': page}
        )
        .then(handleErrors)
        .then(this.parsePages)
        .then(response => response.json())
        .then(json => {
            this.setState({tags: json});
        },
        (error) => {
          this.setState({error: error});
        });
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
      const tags = this.state.tags || [];
      const currentPage = this.state.currentPage;
      const prevExists = this.state.prevExists;
      const nextExists = this.state.nextExists;
      const pages = this.state.pages;
      let tagitems = [];
      for (const tag of tags) {
          tagitems.push(<TagListItem key={tag.id} tag={tag} />)
      }
      if (error) {
          if (error.message === "UNAUTHORIZED") {
              return <RedirectToLogin error={error} />
          }
      }

      return(
          <AdminPage bc={<AdminBC />} menu={<AdminMenu activetab='tags' />}>
            <ErrorMessage error={error} />

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Serial</th>
                        <th>Secret Key</th>
                        <th>Firmware Version</th>
                        <th>Hardware Version</th>
                        <th>Created On (UTC)</th>
                    </tr>
                </thead>
                <tbody>
                {tagitems}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} pages={pages} prevExists={prevExists} nextExists={nextExists}/>
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