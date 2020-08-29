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

class HistorySubject extends StarBaseSubject {
  constructor(starserial) {
    super();
    // Retrieve from localstorage
    this._starredarr = JSON.parse(window.localStorage.getItem('starredarr')) || [];
    this._recentarr = JSON.parse(window.localStorage.getItem('recentarr')) || [];

    // Append star serial to the recent array.
      if (!!starserial) {
          this.push_recent(starserial);
      }

    window.addEventListener('storage', () => {
        // When local storage changes update the array.
        this._starredarr = JSON.parse(window.localStorage.getItem('starredarr'));
        this._recentarr = JSON.parse(window.localStorage.getItem('recentarr')) || [];
        this.notifyAll();
    });
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
    this.controller.model.notifyAll();
  }

  update(updatedmodel) {
    var iconfill = this.star.getElementsByClassName("bi-star-fill")[0];
    var iconempty = this.star.getElementsByClassName("bi-star")[0];

    if (updatedmodel.is_starred(this.star.getAttribute("id"))) {
        // Solid star
        iconfill.setAttribute('display', 'block');
        iconempty.setAttribute('display', 'none');

    } else {
        // Regular star
        iconfill.setAttribute('display', 'none');
        iconempty.setAttribute('display', 'block');
    }
  }
}

class HomePageView {
    constructor(controller, rootelementid) {
    this.controller = controller;

    this.rootelement = document.getElementById(rootelementid);

    this.controller.model.subscribe(this);
    this.controller.model.notifyAll();
  }

  tabulate(taglist, headingstr) {
      var ntags = taglist.length;

      // Create the heading element.
      var heading = document.createElement("h5");
      // Add text to the heading element.
      heading.innerText = headingstr;
      // Add a class to heading element.
      heading.classList.add(["title"]);
      heading.classList.add(["is-5"]);
      heading.classList.add(["mb-3"]);
      // Append heading to the root element.
      this.rootelement.appendChild(heading);

      // Create the table element.
      var tbl = document.createElement('table');
      // Create the body element.
      var tbody = document.createElement('tbody');
      // Add the table class.
      tbody.classList.add("table");

      for (var i=0; i < ntags; i++) {
          // Create the row element.
          var tr = document.createElement('tr');
          // Assign the serial string.
          var str_serial = taglist[i];
          // Create serial column.
          var td_serial = document.createElement('td');
          // Set the id of the 
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
          // Append the row to the table body.
          tbody.appendChild(tr);
      }

      // Append the table body to the table.
      tbl.appendChild(tbody);
      // Append the table to the root element.
      this.rootelement.appendChild(tbl);
  }

  update(updatedmodel) {
      // Build two lists.
      this.tabulate(updatedmodel.starred, "Starred Tags");
      this.tabulate(updatedmodel.recents, "Recent Tags");
  }
}

function init_homepage() {
    let historysubject = new HistorySubject();
    let historycontroller = new HistoryController(historysubject);
    let homepageview = new HomePageView(historycontroller, 'starredrecentlists');
}

function init_tagpage() {
    var star = document.getElementsByClassName("star")[0];

    let historysubject = new HistorySubject(star.getAttribute("id"));
    let historycontroller = new HistoryController(historysubject);

    let starview = new StarView(historycontroller, star);
}

