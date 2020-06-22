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

class ConfigSubject extends BaseSubject {
  constructor() {
    super();
    this._configtext = "";
    this._baseurl = "";
    this._secretkey = "";
    this._trhenabled = true;
    this._usehmac = false;
    this._usehttps = false;
    this._smplintervalmins = 10;
    this._scantimeoutdays = 30;
    this._writepending = false;
  }

  set writepending(value) {
    this._writepending = value;
    this.notifyAll();
  }

  get writepending() {
    return this._writepending;
  }

  set trhenabled(value) {
    this._trhenabled = value;
    this.createConfigText();
  }

  get trhenabled() {
    return this._trhenabled;
  }

  set secretkey(value) {
    this._secretkey = value;
    this.createConfigText();
  }

  get secretkey() {
    return this._secretkey;
  }

  set configtext(value) {
    this._configtext = value;
    this.notifyAll();
  }

  get configtext() {
    return this._configtext;
  }

  set usehmac(value) {
    this._usehmac = value;
    this.createConfigText();
  }

  get usehmac() {
    return this._usehmac;
  }

  set usehttps(value) {
    this._usehttps = value;
    this.createConfigText();
  }

  get usehttps() {
    return this._usehttps;
  }

  set baseurl(value) {
    this._baseurl = value;
    this.createConfigText();
  }

  get baseurl() {
    return this._baseurl;
  }

  set smplintervalmins(value) {
    this._smplintervalmins = value;
    this.createConfigText();
  }

  get smplintervalmins() {
    return this._smplintervalmins;
  }

  set scantimeoutdays(value) {
    this._scantimeoutdays = value;
    this.createConfigText();
  }

  get scantimeoutdays() {
    return this._scantimeoutdays;
  }

  writeNfc() {
    console.log("writing NFC");
    this.writepending = true;
    navigator.nfc.push(this.configtext).then(() => {
      console.log("Completed");
      this.writepending = false;
    }).catch(function(error) {
      console.log("Error");
      this.writepending = false;
    });
    this.notifyAll();
  }

  createConfigLine(key, value) {
    var cline = '<' + key + ':' + value + '>';
    return cline;
  }

  createConfigText() {
    var ctext = '';
    // HTTPS
    ctext += this.createConfigLine('h', this.usehttps ? '1':'0');
    // Append Base URL
    ctext += this.createConfigLine('b', this.baseurl);
    // Append version string
    ctext += this.createConfigLine('v', this.trhenabled ? '11':'12');
    // Append the sample interval string
    ctext += this.createConfigLine('t', this.smplintervalmins.toString());
    // Append scan timeout in days
    ctext += this.createConfigLine('d', this.scantimeoutdays.toString());
    // Append use HMAC
    ctext += this.createConfigLine('i', this.usehmac ? '1':'0');

    if (this.usehmac && (this.secretkey.length == 16)) {
      // Append secret key
      ctext += this.createConfigLine('s', this.secretkey);
    }


    this.configtext = ctext;
  }
}

class Controller {
  constructor(model) {
    this.model = model;
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
  }

  clickHandler(target) {
    var handled = true;
    switch (target.id) {
      case 'writebutton':
        this.model.writeNfc();
        break;
      case 'usehmac':
        this.model.usehmac = target.checked;
        break;
      case 'usehttps':
        this.model.usehttps = target.checked;
        break;

      default:
        handled = false;
    }
  }

  changeHandler(target) {
    switch (target.id) {
      case 'trhradio':
        this.model.trhenabled = target.checked;
        break;
      case 'tempradio':
        this.model.trhenabled = !target.checked;
        break;

    }
  }

  inputHandler(target) {
    switch (target.id) {
      case 'baseurl':
        this.model.baseurl = target.value;
        break;
      case 'secretkeyinput':
        this.model.secretkey = target.value;
        break;
      case 'smplintervalinput':
        this.model.smplintervalmins = target.value;
        break;
      case 'scantimeoutinput':
        this.model.scantimeoutdays = target.value;
        break;
    }
  }
}

class NavView {
  constructor(controller) {
    this.controller = controller;

    this.baseurlinput = document.getElementById('baseurl');
    this.baseurlinput.addEventListener('input', controller);

    this.secretkeyinput = document.getElementById('secretkeyinput');
    this.secretkeyinput.addEventListener('input', controller);

    this.tempradio = document.getElementById('tempradio');
    this.tempradio.addEventListener('change', controller);

    this.trhradio = document.getElementById('trhradio');
    this.trhradio.addEventListener('change', controller);

    this.smplintervalinput = document.getElementById('smplintervalinput');
    this.smplintervalinput.addEventListener('input', controller);

    this.scantimeoutinput = document.getElementById('scantimeoutinput');
    this.scantimeoutinput.addEventListener('input', controller);

    this.usehttps = document.getElementById('usehttps');
    this.usehttps.addEventListener('click', controller);

    this.configtext = document.getElementById('configtext');

    this.usehmac = document.getElementById('usehmac');
    this.usehmac.addEventListener('click', controller);

    this.writebutton = document.getElementById('writebutton');
    this.writebutton.addEventListener('click', controller);


    this.controller.model.subscribe(this);

    this.controller.model.baseurl = window.location.host;
    if (window.location.protocol === 'https:') {
      this.controller.model.usehttps = true;
    } else {
      this.controller.model.usehttps = false;
    }
  }

  update(updatedmodel) {
    this.baseurlinput.value = updatedmodel.baseurl;
    this.usehttps.checked = updatedmodel.usehttps;
    this.usehmac.checked = updatedmodel.usehmac;

    this.secretkeyinput.disabled = !updatedmodel.usehmac;

    this.configtext.value = updatedmodel.configtext;
    this.trhradio.checked = updatedmodel.trhenabled;
    this.tempradio.checked = !updatedmodel.trhenabled;

    this.smplintervalmins = updatedmodel.smplintervalmins;
    this.scantimeoutinput = updatedmodel.scantimeoutdays;

    if (updatedmodel.writepending) {
      this.writebutton.classList.add("is-loading");
    } else {
      this.writebutton.classList.remove("is-loading");
    }
  }


}

document.addEventListener('DOMContentLoaded', () => {
  initialise();
});

function initialise() {
  let subject = new ConfigSubject();
  let controller = new Controller(subject);
  let view = new NavView(controller);
}