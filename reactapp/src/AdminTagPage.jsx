import {AdminPage, ListElement, MenuListElement} from "./AdminPage";
import {getData, postData} from "./api";
import {BulmaControl, BulmaField, BulmaSubmit, ErrorMessage} from "./BasePage";
import React from "react";
import {withRouter} from "react-router-dom";

class AdminTag extends AdminPage {
  constructor(props) {
    super(props);



  }


  componentDidMount() {
      super.componentDidMount();
      const admintoken = this.admintoken;
      const page = new URLSearchParams(this.props.location.search).get("page") || 1;
      const bearertoken = `Bearer ${admintoken}`;
      getData('https://b3.websensor.io/api/admin/tags',
        {'Authorization': bearertoken },
          {'per_page': 3, 'page': page}
        )
        .then(this.handleErrors)
        .then(this.parsePages)
        .then(response => response.json())
        .then(json => {
            this.setState({tags: json});
        },
        (error) => {
          this.setState({error});
        });
      this.setState({activesubtab: 'Simulate'});

  }


  render() {
      const error = this.state.error;
      const tagid = this.props.match.params.id;
      const activesubtab = 'Simulate';
      return (
          <AdminPage activetab="tags">
              <div class="columns">

              <aside className="menu column is-2 is-fullheight">
                  <p className="menu-label is-size-5">
                      <nav className="breadcrumb is-left is-small" aria-label="breadcrumbs">
                          <ul>
                              <li><a href="#">Admin</a></li>
                              <li><a href="#">Tags</a></li>
                              <li  class="is-active"><a href="#" aria-current="page">{'Tag ' + tagid}</a></li>
                          </ul>
                      </nav>
                  </p>
                  <ul className="menu-list">
                      <MenuListElement name="Configure (serial)" url="/admin/tags" active={activesubtab} />
                      <MenuListElement name="Configure (NFC)" url="/admin/captures" active={activesubtab} />
                      <MenuListElement name="Simulate" url="/admin/webhooks" active={activesubtab} />
                      <MenuListElement name="Captures" url="/admin/webhooks" active={activesubtab} />
                      <MenuListElement name="Webhook" url="/admin/webhooks" active={activesubtab} />
                  </ul>
              </aside>
                  <div className="column is-1">
                  <h5>Simulate</h5>
              </div>

              </div>










          </AdminPage>);

  }
}

export default withRouter(AdminTag);