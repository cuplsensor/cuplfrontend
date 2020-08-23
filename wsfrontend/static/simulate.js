class BaseSubject {
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

class SimSubject extends BaseSubject {
  constructor() {
    super();
    this._simurl = "";
    this._baseurl = "";
    this._nsamples = 100;
    this._writepending = false;
  }

  set writepending(value) {
    this._writepending = value;
    this.notifyAll();
  }

  get writepending() {
    return this._writepending;
  }

  set simurl(value) {
    this._simurl = value;
    this.notifyAll();
  }

  get simurl() {
    return this._simurl;
  }

  set baseurl(value) {
    this._baseurl = value;
    this.notifyAll();
  }

  get baseurl() {
    return this._baseurl;
  }

  set nsamples(value) {
    this._nsamples = value;
    this.notifyAll();
  }

  get nsamples() {
    return this._nsamples;
  }

  getSimURL() {
    var simstrurl = new URL('simstr', window.location.href);
    simstrurl.searchParams.append('frontendurl', this.baseurl);
    simstrurl.searchParams.append('nsamples', this.nsamples);
    fetch(simstrurl).then(response => response.text()).then(data => (this.simurl = data));
  }
}

class Controller {
  constructor(model) {
    this.model = model;
  }

  set_enabled() {
    this.model.enabled = true;
  }

  handleEvent(e) {
    switch (e.type) {
      case "click":
        this.clickHandler(e.currentTarget);
        break;

      case "input":
        this.inputHandler(e.currentTarget);
        break;

      case "change":
        this.changeHandler(e.currentTarget);
        break;

      default:
        console.log(e.currentTarget);
    }
    this.model.getSimURL();
  }

  clickHandler(target) {
    var handled = true;
    switch (target.id) {

      default:
        handled = false;
    }
    this.model.getSimURL();
  }

  changeHandler(target) {
    switch (target.id) {
      case 'nsamples':
        this.model.nsamples = target.value;
        break;
    }
    this.model.getSimURL();
  }

  inputHandler(target) {
    switch (target.id) {
      case 'baseurl':
        this.model.baseurl = target.value;
        break;
    }
    this.model.getSimURL();
  }
}

class SimView {
  constructor(controller) {
    this.controller = controller;

    this.baseurlinput = document.getElementById('baseurl');
    this.baseurlinput.addEventListener('input', controller);

    this.nsamples = document.getElementById('nsamples');
    this.nsamples.addEventListener('change', controller);

    this.simurl = document.getElementById('simurl');

    this.controller.model.baseurl = window.location.host;

    this.controller.model.getSimURL();
    this.controller.model.notifyAll();
    this.controller.model.subscribe(this);
  }

  update(updatedmodel) {
    this.nsamples.value = updatedmodel.nsamples;
    this.baseurlinput.value = updatedmodel.baseurl;
    this.simurl.innerHTML = updatedmodel.simurl;
    this.simurl.href = updatedmodel.simurl;
  }


}

let simsubject = new SimSubject();

document.addEventListener('DOMContentLoaded', () => {
  initialise();
});

