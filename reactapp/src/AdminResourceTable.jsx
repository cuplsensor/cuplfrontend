import React from "react";
import {AdminPage, AdminMenu, AdminBC, RedirectToLogin} from "./AdminPage"
import {Link} from "react-router-dom";
import {withRouter, BrowserRouter} from "react-router-dom"
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, ErrorMessage} from "./BasePage";
import {Pagination, parsePages} from "./Pagination";
import {postData, getData, handleErrors, GetAdminToken} from "./api";
import {DateTime} from "luxon";




export class AdminResourceTable extends React.Component {
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
      getData(this.props.url,
        {'Authorization': bearertoken},
          {'per_page': 10, 'page': page}
        )
        .then(handleErrors)
        .then(this.parsePages)
        .then(response => response.json())
        .then(json => {
            this.setState({resources: json});
        },
        (error) => {
          this.setState({error: error});
        });
  }

  render() {
      const error = this.state.error;
      const resources = this.state.resources || [];
      const currentPage = this.state.currentPage;
      const prevExists = this.state.prevExists;
      const nextExists = this.state.nextExists;
      const listitem = this.props.listitem;
      const pages = this.state.pages;
      let resourceitems = [];
      for (const resource of resources) {
          resourceitems.push(<this.props.ListItem key={resource.id} resource={resource} />)
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
                    <this.props.HeaderItem />
                </thead>
                <tbody>
                    {resourceitems}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} pages={pages} prevExists={prevExists} nextExists={nextExists}/>
          </div>
      );
  }
}
