import {AdminPage, ListElement, MenuListElement, RedirectToLogin} from "./AdminPage";
import {getData, postData} from "./api";
import {BulmaControl, BulmaField, BulmaSubmit, ErrorMessage} from "./BasePage";
import React from "react";
import {Redirect, withRouter} from "react-router-dom";

class AdminTagPage extends AdminPage {
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
      const activetab = 'Simulate';
      if (error) {
          if (error.message === "UNAUTHORIZED") {
              return <RedirectToLogin error={error} />
          }
      }
      return (
          <AdminPage bc={<AdminTagBC tagid={tagid} />} menu={<AdminTagMenu tagid={tagid} activetab={activetab} />}>
              {this.props.children}
          </AdminPage>);

  }
}


function AdminTagBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6 menu-label" aria-label="breadcrumbs">
        <ul>
            <li><a href="#">Admin</a></li>
            <li><a href="/admin/tags">Tags</a></li>
            <li className="is-active"><a href="#" aria-current="page">{'Tag ' + props.tagid}</a></li>
        </ul>
      </nav>
    );
}

function AdminTagMenu(props) {
    return (
        <div>
            <ul className="menu-list">
                <MenuListElement name="Edit" url={'/admin/tag/' + props.tagid + '/edit'} active={props.activetab}/>
                <MenuListElement name="Program" url={'/admin/tag/' + props.tagid + '/program'} active={props.activetab}/>
                <MenuListElement name="Configure (serial)" url="/admin/tags" active={props.activetab}/>
                <MenuListElement name="Configure (NFC)" url="/admin/captures" active={props.activetab}/>
                <MenuListElement name="Simulate" url={'/admin/tag/' + props.tagid + '/simulate'} active={props.activetab}/>
                <MenuListElement name="Captures" url="/admin/webhooks" active={props.activetab}/>
                <MenuListElement name="Webhook" url="/admin/webhooks" active={props.activetab}/>
            </ul>
        </div>
    );
}

export default withRouter(AdminTagPage);

