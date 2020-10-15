import React from "react";
import {AdminPage, AdminMenu, AdminBC, RedirectToLogin} from "./AdminPage"
import {Link} from "react-router-dom";
import {withRouter, BrowserRouter} from "react-router-dom"
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, ErrorMessage} from "./BasePage";
import {Pagination, parsePages} from "./Pagination";
import {postData, getData, handleErrors, GetAdminToken} from "./api";
import {DateTime} from "luxon";


function CaptureListItem(props) {
      const timestamp = DateTime.fromISO(props.capture['timestamp']).toLocaleString(DateTime.DATETIME_MED);
      return (
        <tr>
            <td>{props.capture['id']}</td>
            <td><Link to={"/admin/tag/" + props.capture['parent_tag']}>{props.capture['parent_tag']}</Link></td>
            <td>{timestamp}</td>
        </tr>
      );
  }

export class AdminCapturesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
            redirect: false,
    };

    GetAdminToken.call(this);
    this.parsePages = parsePages.bind(this);
  }

  componentDidMount() {
      const page = new URLSearchParams(this.props.location.search).get("page") || 1;
      const bearertoken = `Bearer ${this.admintoken}`;
      getData('https://b3.websensor.io/api/admin/captures',
        {'Authorization': bearertoken},
          {'per_page': 10, 'page': page}
        )
        .then(handleErrors)
        .then(this.parsePages)
        .then(response => response.json())
        .then(json => {
            this.setState({captures: json});
        },
        (error) => {
          this.setState({error: error});
        });
  }

  render() {
      const error = this.state.error;
      const captures = this.state.captures || [];
      const currentPage = this.state.currentPage;
      const prevExists = this.state.prevExists;
      const nextExists = this.state.nextExists;
      const pages = this.state.pages;
      let captureitems = [];
      for (const capture of captures) {
          captureitems.push(<CaptureListItem key={capture.id} capture={capture} />)
      }
      if (error) {
          if (error.message === "UNAUTHORIZED") {
              return <RedirectToLogin error={error} />
          }
      }

      return(
          <div>
              <ErrorMessage error={error} />
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Parent Tag</th>
                        <th>Timestamp (UTC)</th>
                    </tr>
                </thead>
                <tbody>
                {captureitems}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} pages={pages} prevExists={prevExists} nextExists={nextExists}/>
          </div>
      );
  }
}

//export default withRouter(AdminCapturesList);

