import React from "react";
import {AdminPage, AdminMenu, AdminBC, RedirectToLogin} from "./AdminPage"
import {Link} from "react-router-dom";
import {withRouter, BrowserRouter} from "react-router-dom"
import {ErrorMessage} from "./BasePage";
import {Pagination, parsePages} from "./Pagination";
import {getData, handleErrors, GetAdminToken} from "./api";


export class AdminResourceTable extends React.Component {
    constructor(props) {
        super(props);

        GetAdminToken.call(this);
    }

    render() {
        const bearertoken = `Bearer ${this.admintoken}`;
        const extraheaders = {'Authorization': bearertoken};
        return(
            <ResourceTable {...this.props} extraheaders={extraheaders} />
            );

    }
}

export class ResourceTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
            redirect: false,
            resources: [],
            error: false
    };

    GetAdminToken.call(this);
    this.parsePages = parsePages.bind(this);
  }

  componentDidMount() {
      const page = new URLSearchParams(this.props.location.search).get("page") || 1;

      getData(this.props.url,
        this.props.extraheaders,
          {'per_page': (this.props.per_page || 10), 'page': page}
        )
        .then(handleErrors)
        .then(this.parsePages)
        .then(response => response.json())
        .then(json => {
            this.setState({resources: json});
            if (this.props.resourceChangeCallback) {
                this.props.resourceChangeCallback(json);
            }
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
      var showTable = true;
      const pages = this.state.pages;
      let resourceitems = [];
      for (const resource of resources) {
          resourceitems.push(<this.props.ListItem key={resource.id} resource={resource} />)
      }
      if (this.props.showTable !== null) {
          showTable = this.props.showTable;
      }
      const tableDisplay = showTable ? "block" : "none";
      if (error) {
          if (error.code ===401) {
              return <RedirectToLogin error={error} />
          }
      }

      return(
          <div>
              <ErrorMessage error={error} />
            <table className="table" style={{display:tableDisplay}}>
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
