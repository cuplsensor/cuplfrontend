import React from "react";
import {AdminPage, AdminMenu, AdminBC, RedirectToLogin} from "./AdminPage"
import {Link, Redirect, withRouter} from "react-router-dom";
import {BulmaControl, BulmaField, BulmaInput, BulmaLabel, BulmaSubmit, ErrorMessage} from "./BasePage";
import {postData, getData, handleErrors} from "./api";

function PaginationPrevious(props) {
    if (props.exists) {
        const prevhref = `?page=${props.pages['prev']['page']}`;
        return (
            <li>
               <a className="pagination-link" aria-label="Goto page" href={prevhref}>{props.pages['prev']['page']}</a>
            </li>
        );
    } else {
        return('');
    }
}

function PaginationNext(props) {
    if (props.exists) {
        const nexthref = `?page=${props.pages['next']['page']}`;
        return (
            <li>
               <a className="pagination-link" aria-label="Goto page" href={nexthref}>{props.pages['next']['page']}</a>
            </li>
        );
    } else {
        return('');
    }
}

function PaginationEllipsis(props) {
    if (props.display) {
        return (<li><span className="pagination-ellipsis">&hellip;</span></li>);
    } else {
        return ('');
    }
}

function Pagination(props) {
    var lasthref = '#';
    var firsthref = '#';
    var nextislast = true;
    var previsfirst = true;
    if (props.pages !== undefined) {
        firsthref = `?page=${props.pages['first']['page']}`;
        lasthref = `?page=${props.pages['last']['page']}`;
    }
    if (props.nextExists) {
        nextislast = (props.pages['next']['page'] === props.pages['last']['page'])

    }
    if (props.prevExists) {
        previsfirst = (props.pages['prev']['page'] === props.pages['first']['page']);
    }
    const currenthref = `?page=${props.currentPage}`;
    return (<nav className="pagination" role="navigation" aria-label="pagination">
                  <ul className="pagination-list">
                      <li>
                          <a className="pagination-link" aria-label="Page 1" aria-current="page" href={firsthref} disabled={!props.prevExists}>First</a>
                      </li>
                      <PaginationEllipsis display={!previsfirst} />
                      <PaginationPrevious exists={props.prevExists} pages={props.pages} />
                      <li>
                          <a className="pagination-link is-current" aria-label="Goto page {props.currentPage}" href={currenthref}>{props.currentPage}</a>
                      </li>
                      <PaginationNext exists={props.nextExists} pages={props.pages} />
                      <PaginationEllipsis display={!nextislast} />
                      <li>
                          <a className="pagination-link" aria-label="Goto page 3" href={lasthref} disabled={!props.nextExists}>Last</a>
                      </li>
                  </ul>
              </nav>
    );
}

function TagListItem(props) {
      return (
        <tr>
            <td><Link to={"/admin/tag/" + props.tag['id']}>{props.tag['id']}</Link></td>
            <td>{props.tag['serial']}</td>
            <td>{props.tag['secretkey']}</td>
            <td>{props.tag['fwversion']}</td>
            <td>{props.tag['hwversion']}</td>
            <td>{props.tag['timeregistered']}</td>
        </tr>
      );
  }

class AdminListTags extends AdminPage {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.parsePages = this.parsePages.bind(this);
  }

  parsePages(response) {
      var parse = require('parse-link-header');
      const link = response.headers.get('link');
      const parsedlink = parse(link);
      const prevExists = ("prev" in parsedlink);
      const nextExists = ("next" in parsedlink);
      var currentPage;
      // Find out the current page.
      if (!prevExists && !nextExists) {
          // If there is no previous or next entry, then we are on the first page.
          currentPage = parsedlink["first"]["page"];
      }
      else if (!prevExists && nextExists) {
          // If there is no previous entry, then we are on the first page.
          currentPage = parsedlink["first"]["page"];
      }
      else if (prevExists && !nextExists) {
          // If there is no next entry, then we are on the last page.
          currentPage = parsedlink["last"]["page"];
      }
      else {
          // If there is a previous and a next entry we are on the previous page + 1.
          currentPage = parseInt(parsedlink["prev"]["page"]) + 1;
      }
      this.props.history.push({search: `?page=${currentPage}`});

      // Make a list of pagination items.

      this.setState({currentPage: currentPage, pages: parsedlink, prevExists: prevExists, nextExists: nextExists});
      return response;
  }

  componentDidMount() {
      super.componentDidMount();
      const admintoken = this.admintoken;
      console.log(this.admintoken);
      const page = new URLSearchParams(this.props.location.search).get("page") || 1;
      console.log(page);
      const bearertoken = `Bearer ${admintoken}`;
      getData('https://b3.websensor.io/api/admin/tags',
        {'Authorization': bearertoken},
          {'per_page': 10, 'page': page}
        )
        .then(this.handleErrors)
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
      const admintoken = this.admintoken;
      console.log(this.admintoken);
      const bearertoken = `Bearer ${admintoken}`;
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
                        <th>Created On</th>
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

export default withRouter(AdminListTags);