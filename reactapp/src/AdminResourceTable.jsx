import React from "react";
import {AdminPage, AdminMenu, AdminBC, RedirectToLogin} from "./AdminPage"
import {Link} from "react-router-dom";
import {withRouter, BrowserRouter} from "react-router-dom"
import {BulmaControl, BulmaField, BulmaSubmit, ErrorMessage} from "./BasePage";
import {Pagination, parsePages} from "./Pagination";
import {getData, deleteData, handleErrors, GetAdminToken, postData} from "./api";




export class ResourceTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
            redirect: false,
            resources: [],
            extraheaders: this.props.extraheaders || {},
            error: false
    };

    this.parsePages = parsePages.bind(this);
  }

  componentDidMount() {
      const page = new URLSearchParams(this.props.location.search).get("page") || 1;
      getData(this.props.url,
        this.state.extraheaders,
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

  resourceItems() {
      const resources = this.state.resources || [];
      let resourceitems = [];
      for (const resource of resources) {
          resourceitems.push(<this.props.ListItem key={resource.id} resource={resource} />)
      }
      return resourceitems;
  }

  addButton() {
      return "";
  }

  render() {
      const error = this.state.error;
      const currentPage = this.state.currentPage;
      const prevExists = this.state.prevExists;
      const nextExists = this.state.nextExists;
      const listitem = this.props.listitem;
      var hideTable = false;
      const pages = this.state.pages;
      const resourceitems = this.resourceItems();
      const addbutton = this.addButton();

      if (this.props.hideTable) {
          hideTable = this.props.hideTable;
      }
      const tableDisplay = hideTable ? "none" : "block";
      if (error) {
          if (error.code ===401) {
              return <RedirectToLogin error={error} />
          }
      }

      return(
          <>
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
              {addbutton}
              </>
      );
  }
}

export class AdminResourceTable extends ResourceTable {
    constructor(props) {
        super(props);

        GetAdminToken.call(this);

        const bearertoken = `Bearer ${this.admintoken}`;
        const extraheaders = {'Authorization': bearertoken};

        this.state = {
            redirect: false,
            resources: [],
            extraheaders: extraheaders,
            error: false
        };

        this.addResource = this.addResource.bind(this);
        this.deleteResource = this.deleteResource.bind(this);
    }

    addResource(event) {
      postData(this.props.url,
        {},
        this.state.extraheaders)
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.componentDidMount();
        },
        (error) => {
            if (error) {
                this.setState({error: error});
            }

        });
      event.preventDefault();
    }

    deleteResource(resourceurl) {
      deleteData(resourceurl, this.state.extraheaders)
          .then(handleErrors)
          .then(json => {
            this.componentDidMount();
        },
          (error) => {
          this.setState({error: error});
      });
    }

    resourceItems() {
      const resources = this.state.resources || [];
      let resourceitems = [];
      for (const resource of resources) {
          resourceitems.push(<this.props.ListItem key={resource.id} resource={resource} deleteFcn={this.deleteResource} />)
      }
      return resourceitems;
  }

  addButton() {
        var addbutton;
        if (this.props.showAdd) {
            addbutton =
          <>
            <br/>
            <form onSubmit={this.addResource}>
                <BulmaField>
                  <BulmaControl>
                    <BulmaSubmit value="Quick Add" />
                  </BulmaControl>
                </BulmaField>
            </form>
          </>
        } else {
            addbutton = "";
        }
        return addbutton;
  }

}