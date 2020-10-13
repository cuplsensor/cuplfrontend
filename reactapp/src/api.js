import {DateTime} from "luxon";

export async function postData(url = '', data = {}, extraheaders = {}) {
  const defaultheader = {'Content-Type': 'application/json'}
  const headers = Object.assign({}, defaultheader, extraheaders);

  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: headers,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}



// Example POST method implementation:
export async function getData(url = '', extraheaders = {}, params = {}) {
  const defaultheader = {'Content-Type': 'application/json'}
  const headers = Object.assign({}, defaultheader, extraheaders);

  var url = new URL(url);

  for (var key in params) {
    url.searchParams.append(key, params[key]);
  }

  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: headers,
  });
  return response; // parses JSON response into native JavaScript objects
}

export async function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
  }

/* https://zellwk.com/blog/async-await-in-loops/ */
async function getRemainingPages(response, url, extraheaders, per_page) {
    var parse = require('parse-link-header');
    const link = response.headers.get('link');
    const parsedlink = parse(link);
    const lastpage = parsedlink['last']['page'];
    var pagesToGet = [];
    for (var page = 2; page <= lastpage; page++) {
        pagesToGet.push(page);
    }
    const promises = pagesToGet.map(async page => {
        return getData(url, extraheaders, {page: page, per_page: per_page})
        .then(handleErrors)
        .then(response => {
              return response
        });
    });

    return promises;
}

// Get all pages in a paginated request.
export async function getAllData(url = '', extraheaders = {}, per_page = 10) {
  var jsonlist = [];
  const params = {page: 1, per_page: per_page};
  const firstresponse = await getData(url, extraheaders, params)
          .then(handleErrors)
          .then(response => {
              return response
          });

  const pagepromises = await getRemainingPages(firstresponse, url, extraheaders, per_page);
  var allresponses = await Promise.all(pagepromises);
  allresponses.push(firstresponse);

  const jsonpromises = allresponses.map(async response => {
      return response.json()
    });

  const alljson = await Promise.all(jsonpromises);

  for (const json of alljson) {
      jsonlist.push(...json);
  }

  return new Promise(resolve => {resolve(jsonlist)});
}

export async function getSamples(samples_url, zone) {
      const samples = await getAllData(samples_url,
          {},
          100
      );

      // Add timestamp here.
      const sampleswithtime = samples.map(function(el) {
          var o = Object.assign({}, el);
          o.time = DateTime.fromISO(el['timestamp'], {zone: 'utc'}).setZone(zone);
          return o;
        });

      sampleswithtime.sort(function(a, b) {
          var keyA = a.time,
            keyB = b.time;
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

      return new Promise(resolve => {resolve(sampleswithtime)});
  }