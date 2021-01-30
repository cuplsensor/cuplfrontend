/*
 * Copyright (c) 2021. Plotsensor Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import {RedirectToLogin} from "./AdminPage"
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
      const pageparams = {'per_page': (this.props.per_page || 10), 'page': page};
      const params = Object.assign({}, pageparams, this.props.extraparams)
      getData(this.props.url, this.state.extraheaders, params)
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

  headerItem() {
      return <this.props.HeaderItem />;
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
      const headerItem = this.headerItem();
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
                    {headerItem}
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
            hideSecret: true,
            error: false
        };

        this.addResource = this.addResource.bind(this);
        this.deleteResource = this.deleteResource.bind(this);
        this.toggleHideSecret = this.toggleHideSecret.bind(this);
    }

    toggleHideSecret() {
        this.setState({hideSecret: !this.state.hideSecret});
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

    headerItem() {
      return <this.props.HeaderItem hideSecret={this.state.hideSecret} eyeClicked={this.toggleHideSecret} />;
    }

    resourceItems() {
      const resources = this.state.resources || [];
      let resourceitems = [];
      for (const resource of resources) {
          resourceitems.push(<this.props.ListItem key={resource.id} resource={resource} hideSecret={this.state.hideSecret} deleteFcn={this.deleteResource} />)
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