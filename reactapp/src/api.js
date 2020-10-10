// Example POST method implementation:
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