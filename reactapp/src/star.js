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

class StarBaseSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    let index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.slice(index, 1);
    }
  }

  notifyAll() {
    for (let o of this.observers) {
      o.update(this);
      console.log(o.name, "has been notified");
    }
  }
}

export class HistorySubject extends StarBaseSubject {
  constructor() {
    super();
    // Retrieve from localstorage
    this._starredarr = JSON.parse(window.localStorage.getItem('starredarr')) || [];
    this._recentarr = JSON.parse(window.localStorage.getItem('recentarr')) || [];

    window.addEventListener('storage', () => {
        // When local storage changes update the array.
        this._starredarr = JSON.parse(window.localStorage.getItem('starredarr'));
        this._recentarr = JSON.parse(window.localStorage.getItem('recentarr')) || [];
        this.notifyAll();
    });
  }

  update_recent(ser) {
      // Append star serial to the recent array.
      console.log("updating recents");
      if (!!ser) {
          this.push_recent(ser);
      }
  }

  toggle_starred(ser) {
      var arrindex = this._starredarr.indexOf(ser);
      if (arrindex === -1) {
          // Does not exist, so add to the beginning.
          this._starredarr.unshift(ser);
      } else {
          // Does exist, so remove from array.
          this._starredarr.splice(arrindex, 1);
      }
      // Update local storage
      window.localStorage.setItem('starredarr', JSON.stringify(this._starredarr));
      this.notifyAll();
  }

  is_starred(ser) {
      var arrindex = this._starredarr.indexOf(ser);
      if (arrindex === -1) {
          return false;
      } else {
          return true;
      }
  }

  get starred() {
      return this._starredarr;
  }

  push_recent(ser) {
      var arrindex = this._recentarr.indexOf(ser);
      if (arrindex !== -1) {
          // Does exist, so remove from array.
          this._recentarr.splice(arrindex, 1);
      }
      // Add to the beginning.
      this._recentarr.unshift(ser);
      // The array should be no longer than 3 elements.
      this._recentarr =  this._recentarr.slice(0,3);
      // Update local storage
      window.localStorage.setItem('recentarr', JSON.stringify(this._recentarr));
      this.notifyAll();
  }

  get recents() {
      return this._recentarr;
  }
}

class HistoryController {
  constructor(model) {
    this.model = model;
  }

  handleEvent(e) {
    switch (e.type) {
      case "click":
        this.clickHandler(e.currentTarget);
        break;

      default:
        console.log(e.currentTarget);
    }
  }

  clickHandler(target) {
    var handled = true;

    if (target.classList.contains("star")) {
        this.model.toggle_starred(target.getAttribute("id"));
    } else {
        handled = false;
    }
  }
}

class StarView {
  constructor(controller, star) {
    this.controller = controller;

    this.star = star;
    this.star.addEventListener('click', controller);

    this.controller.model.subscribe(this);
  }

  update(updatedmodel) {

    if (updatedmodel.is_starred(this.star.getAttribute("id"))) {
        // Solid star
        this.star.innerHTML = '<svg width="1em" height="1em" display="block" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>';

    } else {
        // Regular star
        this.star.innerHTML = '<svg width="1em" height="1em" display="block" viewBox="0 0 16 16" class="bi bi-star" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>';
    }
  }
}

class HomePageView {
    constructor(controller, rootelementid) {
    this.controller = controller;

    this.rootelement = document.getElementById(rootelementid);
    this.starviews = [];
    this.recentviews = [];

    this.controller.model.subscribe(this);
    this.controller.model.notifyAll();
  }

  appendsummary(tr, responsedata) {
      // Create a temperature column.
      var td_temp = document.createElement('td');
      // Create temperature element.
      var p_temp = document.createElement('p');
      // Create text element.
      var text_temp = document.createTextNode(responsedata['temp'] + '°C');
      // Create a rh column.
      var td_rh = document.createElement('td');
      // Create rh element.
      var p_rh = document.createElement('p');
      // Create text element.
      var text_rh = document.createTextNode(responsedata['rh'] + '%');
      // Create a description column.
      var td_description = document.createElement('td');
      // Create rh element.
      var p_description = document.createElement('p');
      // Create text element.
      var text_description = document.createTextNode(responsedata['description']);

      p_temp.appendChild(text_temp);
      td_temp.appendChild(p_temp);
      tr.appendChild(td_temp);

      p_rh.appendChild(text_rh);
      td_rh.appendChild(p_rh);
      tr.appendChild(td_rh);

      p_description.appendChild(text_description);
      td_description.appendChild(p_description);
      tr.appendChild(td_description);
  }

  parseresponse(tr, callback, response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(callback.bind(null, tr));
  }

  tabulate(taglist, headingstr) {
      var ntags = taglist.length;
      var starlist = [];

      var section = document.createElement('section');
      section.classList.add("section");
      var container = document.createElement('div');
      container.classList.add("container");

      // Create the heading element.
      var heading = document.createElement("h5");
      // Add text to the heading element.
      heading.innerText = headingstr;
      // Add a class to heading element.
      heading.classList.add(["title"]);
      heading.classList.add(["is-5"]);
      heading.classList.add(["mb-3"]);
      // Append heading to the root element.
      container.appendChild(heading);

      // Create the table element.
      var tbl = document.createElement('table');
      // Add the table class.
      tbl.classList.add("table");

      // Create the body element.
      var tbody = document.createElement('tbody');

      for (var i=0; i < ntags; i++) {
          // Create the row element.
          var tr = document.createElement('tr');
          // Assign the serial string.
          var str_serial = taglist[i];

          // Create serial column.
          var td_serial = document.createElement('td');
          // Create serial anchor.
          var a_serial = document.createElement('a');
          // Set link in the anchor.
          a_serial.setAttribute('href', '/tag/'+str_serial);
          // Set string in the anchor.
          a_serial.innerText = str_serial;
          // Append the anchor to the column element.
          td_serial.appendChild(a_serial);
          // Append serial column to the row.
          tr.appendChild(td_serial);

          // Create the star column.
          var td_star = document.createElement('td');
          // Create the star anchor.
          var a_star = document.createElement('a');
          // Set the id of the star anchor
          a_star.setAttribute("id", str_serial);
          // Set the classes of the star anchor
          a_star.classList.add("star");
          // Append the anchor to the column element.
          td_star.appendChild(a_star);
          // Append serial column to the row.
          tr.appendChild(td_star);
          // Run a fetch request.
          fetch('/tag/'+str_serial+'/summary').then(this.parseresponse.bind(null, tr, this.appendsummary));

          // Append the row to the table body.
          tbody.appendChild(tr);
          // Add the tdserial DOM element to a list.
          starlist.push(a_star);
      }

      // Append the table body to the table.
      tbl.appendChild(tbody);
      // Append table to the container.
      container.appendChild(tbl);
      // Append the container to the section.
      section.appendChild(container);
      // Append the section to the root element.
      this.rootelement.appendChild(section);
      // Return the a_star elements. These will have starviews added to them.
      return starlist;
  }

  update(updatedmodel) {
        // Clear the root element
      this.rootelement.innerHTML = '';
      this.starviews = [];
      this.recentviews = [];

      // Build two lists.
      var starlist = this.tabulate(updatedmodel.starred, "Starred Tags");
      var recentlist = this.tabulate(updatedmodel.recents, "Recent Tags");

      for (var i=0; i < starlist.length; i++) {
          this.starviews.push(new StarView(this.controller, starlist[i]));
      }

      for (var i=0; i < recentlist.length; i++) {
          this.recentviews.push(new StarView(this.controller, recentlist[i]));
      }
  }
}

// function init_homepage() {
//     let historysubject = new HistorySubject();
//     let historycontroller = new HistoryController(historysubject);
//     homepageview = new HomePageView(historycontroller, 'starredrecentlists');
// }
//
// function init_tagpage() {
//     var star = document.getElementsByClassName("star")[0];
//
//     let historysubject = new HistorySubject(star.getAttribute("id"));
//     let historycontroller = new HistoryController(historysubject);
//
//     let starview = new StarView(historycontroller, star);
//     historysubject.notifyAll();
// }

