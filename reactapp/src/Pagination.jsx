import React from "react";

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

export function Pagination(props) {
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

export function parsePages(response) {
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