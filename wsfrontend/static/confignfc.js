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
    this._serial = "";
    this._baseurl = "";
    this._secretkey = "";
    this._trhenabled = true;
    this._usehmac = false;
    this._usehttps = false;
    this._smplintervalmins = 10;
    this._minbatv = 2200;
    this._enabled = false;
    this._writepending = false;
  }

  set writepending(value) {
    this._writepending = value;
    this.notifyAll();
  }

  get writepending() {
    return this._writepending;
  }

  set serial(value) {
    this._serial = value;
    this.notifyAll();
  }

  get serial() {
    return this._serial;
  }

  set trhenabled(value) {
    this._trhenabled = value;
    this.notifyAll();
  }

  get trhenabled() {
    return this._trhenabled;
  }

  set secretkey(value) {
    this._secretkey = value;
    this.usehmac = (value !== "");
    this.notifyAll();
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
    this.notifyAll();
  }

  get usehmac() {
    return this._usehmac;
  }

  set usehttps(value) {
    this._usehttps = value;
    this.notifyAll();
  }

  get usehttps() {
    return this._usehttps;
  }

  set baseurl(value) {
    this._baseurl = value;
    this.notifyAll();
  }

  get baseurl() {
    return this._baseurl;
  }

  set smplintervalmins(value) {
    this._smplintervalmins = value;
    this.notifyAll();
  }

  get smplintervalmins() {
    return this._smplintervalmins;
  }

  set minbatv(value) {
    this._minbatv = value;
    this.notifyAll();
  }

  get minbatv() {
    return this._minbatv;
  }

  set enabled(value) {
    this._enabled = value;
    this.notifyAll();
  }

  get enabled() {
    return this._enabled;
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

  createConfigList() {
    var configlist = [];


    if (this.serial.length === 8) {
      configlist.push(this.createConfigLine('w', this.serial));                     // Serial
    }
    configlist.push(this.createConfigLine('h', this.usehttps ? '1':'0'));           // HTTPS
    configlist.push(this.createConfigLine('b', this.baseurl));                      // Append Base URL
    configlist.push(this.createConfigLine('f', this.trhenabled ? '1':'2'));         // Append version string
    configlist.push(this.createConfigLine('t', this.smplintervalmins.toString()));  // Append the sample interval string
    configlist.push(this.createConfigLine('u', this.minbatv.toString()))
    configlist.push(this.createConfigLine('i', this.usehmac ? '1':'0'));            // Append use HMAC
    if (this.usehmac && (this.secretkey.length === 16)) {
      // Append secret key
      configlist.push(this.createConfigLine('s', this.secretkey));                  // Append secret key
    }

    this.configlist = configlist;
  }

  createConfigText() {
    this.createConfigList();

    var ctext = '';

    this.configlist.forEach(function(configstr) {
      ctext += configstr;
    });

    this.configtext = ctext;
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
    this.model.createConfigText();
  }

  clickHandler(target) {
    var handled = true;
    switch (target.id) {
      case 'writebutton':
        this.model.writeNfc();
        break;
      case 'usehmac':
        if (target.checked === false) {
          this.model.secretkey = "";
        }
        this.model.usehmac = (this.model.secretkey !== "");
        break;
      case 'usehttps':
        this.model.usehttps = target.checked;
        break;

      default:
        handled = false;
    }
    this.model.createConfigText();
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
    this.model.createConfigText();
  }

  inputHandler(target) {
    switch (target.id) {
      case 'baseurl':
        this.model.baseurl = target.value;
        break;
      case 'serialinput':
        this.model.serial = target.value;
        break;
      case 'secretkeyinput':
        this.model.secretkey = target.value;
        break;
      case 'smplintervalinput':
        this.model.smplintervalmins = target.value;
        break;
    }
    this.model.createConfigText();
  }
}

class NavView {
  constructor(controller) {
    this.controller = controller;

    this.serialinput = document.getElementById('serialinput');
    this.serialinput.addEventListener('input', controller);

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

    this.minbatv = document.getElementById('minbatvoltagemv');
    this.minbatv.addEventListener('change', controller);

    this.usehttps = document.getElementById('usehttps');
    this.usehttps.addEventListener('click', controller);

    this.configtext = document.getElementById('configtext');

    this.usehmac = document.getElementById('usehmac');
    this.usehmac.addEventListener('click', controller);



    this.controller.model.serial = this.serialinput.value;
    this.controller.model.secretkey = this.secretkeyinput.value;
    this.controller.model.baseurl = window.location.host;
    if (window.location.protocol === 'https:') {
      this.controller.model.usehttps = true;
    } else {
      this.controller.model.usehttps = false;
    }
    this.controller.model.createConfigText();
    this.controller.model.notifyAll();
    this.controller.model.subscribe(this);
  }

  update(updatedmodel) {
    this.baseurlinput.value = updatedmodel.baseurl;
    this.usehttps.checked = updatedmodel.usehttps;
    this.secretkeyinput.value = updatedmodel.secretkey;
    this.minbatv = updatedmodel.minbatv;

    this.usehmac.checked = updatedmodel.secretkey.length > 0;

    this.configtext.value = updatedmodel.configtext;
    this.trhradio.checked = updatedmodel.trhenabled;
    this.tempradio.checked = !updatedmodel.trhenabled;

    this.smplintervalmins = updatedmodel.smplintervalmins;
  }


}

let configsubject = new ConfigSubject();

document.addEventListener('DOMContentLoaded', () => {
  initialise();
});

