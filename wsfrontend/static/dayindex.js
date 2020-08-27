const rhchartdata = {
  label: 'Relative Humidity (%)',
  backgroundColor: 'rgba(153,226,255,0.5)',
  borderColor: 'rgba(153,226,235,1)',
  pointBackgroundColor: 'rgba(153,226,235,1)'
}

const tempchartdata = {
  label: 'Temperature (°C)',
  backgroundColor: 'rgba(220,100,94,0.5)',
  borderColor: 'rgba(220,100,94,1)',
  pointBackgroundColor: 'rgba(220,100,94,1)'
}

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

class BoxSubject extends BaseSubject {
  constructor(locapiurl) {
    super(); // Call the super class constructor.
    this.recentlocations = null;
    this.locationapiUrl = locapiurl;
    this.sensor = 'temp';
    this._tz = null;
  }

  get tz() {
    return this._tz;
  }

  set tz(value) {
    this._tz = value;
  }

  getLocations() {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": this.locationapiUrl,
      "method": "GET",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "64622317-7980-3ea7-b72f-a16ea3a9b507"
      }
    }

    $.ajax(settings).done(function (response) {
      this.recentlocations = response;
      this.notifyAll();
    }.bind(this));
  }
}

class CalendarSubject extends BoxSubject {
  constructor(locapiurl, caljsonurl) {
    super(locapiurl); // Call the super class constructor.
    this.caljsonurl = caljsonurl;
    this.range = null;
    this.date = null;
    this.capsamples = null;
  }

  editLocation(locid, actionurl, serialisedform) {
    var form = new FormData();

    form.append("location_id", serialisedform['editloc-location_id']);
    form.append("csrf_token", serialisedform['editloc-csrf_token']);
    form.append("description", serialisedform['editloc-description']);

    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", serialisedform['editloc-csrf_token']);
        }
      }
    });

    var settings = {
      "async": true,
      "crossDomain": false,
      "url": actionurl + locid,
      "method": "PUT",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "36bbd01e-aff2-ff3d-8a9d-c3aecee600a9"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
  }

    $.ajax(settings).done(function (response) {
      this.reqCaptureSamples();
      this.getLocations();
    }.bind(this));
  }

  deleteLocation(locid, actionurl) {
    var settings = {
      "async": true,
      "crossDomain": false,
      "url": actionurl + locid,
      "method": "DELETE",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "36bbd01e-aff2-ff3d-8a9d-c3aecee600a9"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": null
  }

    $.ajax(settings).done(function (response) {
      this.reqCaptureSamples();
      this.getLocations();
    }.bind(this));
  }

  postNewLocation(serialisedform, actionurl) {
    // Inject our CSRF token into our AJAX request.
    var form = new FormData();

    form.append("description", serialisedform['newloc-description']);
    form.append("csrf_token", serialisedform['newloc-csrf_token']);
    form.append("capturesample_id", serialisedform['newloc-capturesample_id']);

    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", serialisedform['newloc-csrf_token']);
        }
      }
    });

    var settings = {
      "async": true,
      "crossDomain": false,
      "url": actionurl,
      "method": "POST",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "36bbd01e-aff2-ff3d-8a9d-c3aecee600a9"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
  }

    $.ajax(settings).done(function (response) {
      this.reqCaptureSamples();
      this.getLocations();
    }.bind(this));
  }

  getDateAsYmd(dateobj) {
    if (dateobj === null) {
      return null;
    }
    var year = dateobj.getFullYear();
    var month = dateobj.getMonth()+1;
    var day = dateobj.getDate();

    var dateymd = {
      year: String(year),
      month: String(month),
      day: String(day)
    }

    return dateymd;
  }

  reqCaptureSamples() {
    if (this.checkForUndefined() == true) {
      return;
    }

    var form = new FormData();
    var dateymd = this.getDateAsYmd(this.date);
    var tzoffsetmins = moment(this.date).tz(this.tz).utcOffset();

    form.append("year", dateymd.year);
    form.append("month", dateymd.month);
    form.append("day", dateymd.day);
    form.append("tzoffsetmins", tzoffsetmins);
    form.append("range", this.range);

    var settings = {
      "async": true,
      "crossDomain": false,
      "url": this.caljsonurl,
      "method": "POST",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "36bbd01e-aff2-ff3d-8a9d-c3aecee600a9"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
  }

    $.ajax(settings).done(function (response) {
      var respobj = JSON.parse(response);
      this.capsamples = respobj;
      this.notifyAll();
    }.bind(this));
  }

  checkForUndefined() {
    return (this.sensor == null) || (this.range == null) || (this.date == null) || (this.tz == null);
  }

  get sensor() {
    return this._sensor;
  }

  set sensor(value) {
    this._sensor = value;
  }

  get range() {
    return this._range;
  }

  set range(value) {
    this._range = value;
    this.reqCaptureSamples();
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this._date = value;
    this.reqCaptureSamples();
  }
}

class BoxController {
  constructor(model) {
    this.model = model;
    var tz = this.getUrlParameter('tz');

    if (tz == "") {
      tz = moment.tz.guess();
    }

    this.model.tz = tz;
  }

  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  handleEvent(e) {
    switch(e.type) {
      case "click":
        this.clickHandler(e.currentTarget);
        break;
      }
  }

  populateList() {
    this.model.getLocations();
  }

  clickHandler(target) {
    var handled = true;
    switch(target.id) {

    }
  }
}

class CalendarController extends BoxController {
  constructor(model, sensor, range, dateymd) {
    super(model);
    this.model.sensor = sensor;
    this.model.range = range;
    this.newlocform = document.getElementById('newlocation');
    this.editlocform = document.getElementById('editlocation');

    if (dateymd == null) {
      this.dateToToday();
    } else {
      this.dateToYmd(dateymd);
    }


  }

  handleEvent(e) {
    switch(e.type) {
      case "click":
        this.clickHandler(e.currentTarget);
        break;
      case "change":
        this.changeHandler(e.currentTarget);
        break;
      default:
        console.log(e.currentTarget);
    }
  }

  dateToYmd(dateymd) {
    var year, month, day;
    year = dateymd.year;
    month = dateymd.month-1;
    day = dateymd.day;
    this.model.date = new Date(Date.UTC(year, month, day));
  }

  dateToToday() {
    var year, month, day;
    var f = new Date(); // The date today in local time.
    year = f.getFullYear();
    month = f.getMonth();
    day = f.getDate();
    this.model.date = new Date(Date.UTC(year, month, day));
  }

  incrementByDays(days) {
    this.model.date.setDate(this.model.date.getDate() + days);
    this.model.date = this.model.date;
  }

  formToObj(form) {
    var jq_form = $(form)
    var formdata = new FormData();;
    $.each(jq_form.serializeArray(), function() {
      formdata[this.name] = this.value;
    });
    return formdata;
  }

  clickHandler(target) {
    var handled = true;
    switch(target.id) {
      case 'tempbutton':
        this.model.sensor = 'temp';
        break;
      case 'humiditybutton':
        this.model.sensor = 'rh';
        break;
      case 'daybutton':
        this.model.range = 'day';
        break;
      case 'weekbutton':
        this.model.range = 'week';
        break;
      case 'monthbutton':
        this.model.range = 'month';
        break;
      case 'leftbutton':
        this.incrementByDays(-1);
        break;
      case 'rightbutton':
        this.incrementByDays(1);
        break;
      case 'todaybutton':
        this.dateToToday();
        break;
      case 'downloadcsvbutton':
        this.downloadcsv();
        break;
      default:
        handled = false;
      }

      if (handled) {
        this.model.notifyAll();
      }

    }

    changeHandler(target) {
      if (target.id == "datepicker") {
        this.model.date = target.valueAsDate;
      }

      this.model.notifyAll();
    }

    downloadcsv() {
      var samplesarray = this.model.capsamples.samples;
      var tzoffsetmins = moment(this.model.date).tz(this.model.tz).utcOffset();
      var csvarray = [];

      for (var el in samplesarray)
      {
        var timestamp = samplesarray[el]['timestamp'] + 'Z';
        var row = {
          Datetime: moment(timestamp).utcOffset(tzoffsetmins).format('YYYY-MM-DD HH:mm:ss'),
          Temperature: samplesarray[el]['temp'].toFixed(2),

        };

        if ('rh' in samplesarray[el]) {
          row['Relative Humidity'] = samplesarray[el]['rh'].toFixed(2);
        }
        csvarray.push(row);
      }

      downloadCSV({ filename: "stock-data.csv", data:csvarray });

    }

}

class UrlMaker {
  constructor(baseurl) {
    this.baseurl = baseurl;
  }

  makeUrl(range, sensor, dateymd, tz) {
    if ((range !== null) && (sensor != null) && (dateymd != null) && (tz != null)) {
      var tzencoded = encodeURIComponent(tz);
      return this.baseurl + range +'/'+ sensor +'/'+ dateymd.year +'/'+ dateymd.month +'/' + dateymd.day +'?tz='+ tzencoded;

    } else {
      return null;
    }
  }

  getDateAsYmd(dateobj) {
    if (dateobj === null) {
      return null;
    }
    var year = dateobj.getFullYear();
    var month = dateobj.getMonth()+1;
    var day = dateobj.getDate();

    var dateymd = {
      year: String(year),
      month: String(month),
      day: String(day)
    }

    return dateymd;
  }
}

class NavView {
  constructor(controller) {
    this.controller = controller;

    this.humiditybutton = document.getElementById('humiditybutton');
    this.humiditybutton.addEventListener('click', controller);

    this.tempbutton = document.getElementById('tempbutton');
    this.tempbutton.addEventListener('click', controller);

    this.daybutton = document.getElementById('daybutton');
    this.daybutton.addEventListener('click', controller);

    this.weekbutton = document.getElementById('weekbutton');
    this.weekbutton.addEventListener('click', controller);

    this.monthbutton = document.getElementById('monthbutton');
    this.monthbutton.addEventListener('click', controller);

    this.datepicker = document.getElementById('datepicker');
    this.datepicker.addEventListener('change', controller);

    this.leftbutton = document.getElementById('leftbutton');
    this.leftbutton.addEventListener('click', controller);

    this.rightbutton = document.getElementById('rightbutton');
    this.rightbutton.addEventListener('click', controller);

    this.todaybutton = document.getElementById('todaybutton');
    this.todaybutton.addEventListener('click', controller);

    this.downloadcsvbutton = document.getElementById('downloadcsvbutton');
    this.downloadcsvbutton.addEventListener('click', controller);

    this.controller.model.subscribe(this);
  }

  update(modeldata) {
    switch(modeldata.sensor) {
      case 'temp':
        this.tempbutton.classList.add('is-active');
        this.humiditybutton.classList.remove('is-active');
        break;
      case 'rh':
        this.tempbutton.classList.remove('is-active');
        this.humiditybutton.classList.add('is-active');
        break;
    }

    switch(modeldata.range) {
      case 'day':
        this.daybutton.classList.add('is-active');
        this.weekbutton.classList.remove('is-active');
        this.monthbutton.classList.remove('is-active');
        break;
      case 'week':
        this.daybutton.classList.remove('is-active');
        this.weekbutton.classList.add('is-active');
        this.monthbutton.classList.remove('is-active');
        break;
      case 'month':
        this.daybutton.classList.remove('is-active');
        this.weekbutton.classList.remove('is-active');
        this.monthbutton.classList.add('is-active');
        break;
    }

    this.datepicker.valueAsDate = modeldata.date;
    console.log(modeldata.date);

  }
}

class UrlView extends UrlMaker {
  constructor(controller, baseurl) {
    super(baseurl);
    this.controller = controller;
    this.controller.model.subscribe(this);
  }

  update(modeldata) {
    var dateymd = this.getDateAsYmd(modeldata.date);
    var range = modeldata.range;
    var sensor = modeldata.sensor;
    var tz = modeldata.tz;
    var urlstr = this.makeUrl(range, sensor, dateymd, tz);
    // No proper support for the back button yet.
    window.history.replaceState("object or string", "Title", urlstr);
  }
}

class ChartView {
  constructor(controller) {
    this.controller = controller;
    this.controller.model.subscribe(this);
    this.tickformat = 'HH';
    this.createchart();
  }

  ticksCallback(value, index, values) {
    if (values.length > 0) {
      return moment(values[index]['value']).tz(this.controller.model.tz).format(this.tickformat);
    }
    else {
      return value;
    }
  }

  createchart() {
    var ctx = document.getElementById("myChart");
    this.chart = new Chart(ctx, {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        layout: {
          padding: {
            left: 10
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'linear',
            time: {
              tooltipFormat: 'h:mm'
            },
            ticks: {
              // Create scientific notation labels
              callback: function(value, index, values) {
                return this.ticksCallback(value, index, values);
            }.bind(this)
          }
          }],
          yAxes: [{
            ticks: {
            }
          }]
        }
      }
    });
  }

  updatechart(linechartdata, xmin, xmax) {
    this.chart.data.datasets.pop();
    this.chart.data.datasets.push(linechartdata);
    this.chart.options.scales.xAxes[0].time.min = xmin;
    this.chart.options.scales.xAxes[0].time.max = xmax;
    this.chart.update();
  }

  update(modeldata) {
    // Create pointarray.
    var pointarray = [];
    var sourcechartdata = null;
    var pointradius = null;

    if (modeldata.capsamples == null) {
      return;
    }

    var xmin = modeldata.capsamples.startstamp*1000;
    var xmax = modeldata.capsamples.endstamp*1000;

    for (let sample of modeldata.capsamples.samples) {
      var timestamp = sample['timestamp'] + 'Z';
      pointarray.push({
         x: moment(timestamp).tz(modeldata.tz),
         y: sample[modeldata.sensor].toFixed(2)
      });
    }

    switch (modeldata.range) {
      case 'day':
      this.tickformat = 'HH';
      pointradius = 3;
      break;
      case 'week':
      this.tickformat = 'dddd Do';
      pointradius = 2;
      break;
      case 'month':
      this.tickformat = 'Do';
      pointradius = 1;
      break;
    }

    if (modeldata.sensor == 'temp') {
      sourcechartdata = tempchartdata;
    } else {
      sourcechartdata = rhchartdata;
    }

    var linechartdata = {
        label: sourcechartdata.label,
        backgroundColor: sourcechartdata.backgroundColor,
        borderColor: sourcechartdata.borderColor,
        pointBackgroundColor: sourcechartdata.pointBackgroundColor,
        pointRadius: pointradius,
        borderWidth: pointradius,
        data: pointarray
      };

      this.updatechart(linechartdata, xmin, xmax);
  }
}

class TableView {
  constructor(controller) {
    this.controller = controller;
    this.controller.model.subscribe(this);
    this.tablediv = document.getElementById('samplesdiv');
  }

  handleEvent(e) {
    switch (e.type) {
      case "click":
        this.clickHandler(e.currentTarget);
        break;
      case "change":
        this.changeHandler(e.currentTarget);
        break;
      case "submit":
        this.submitHandler(e.currentTarget);
        e.preventDefault(); // avoid to execute the actual submit of the form.
        break;
      default:
        console.log(e.currentTarget);
    }
  }

  tableHeader(datestr) {
    var newtable = document.createElement('table');
    var newtablehead = document.createElement('thead');
    var trtableheadingrow = document.createElement('tr');
    var trtableheading = document.createElement('th');
    var trcolheadings = document.createElement('tr');
    var thtime = document.createElement('th');
    var threading = document.createElement('th');
    var newtablebody = document.createElement('tbody');

    newtable.setAttribute("class", "table");
    trtableheadingrow.appendChild(trtableheading);
    trtableheading.setAttribute("class", "stickyheading");
    trtableheading.appendChild(document.createTextNode(datestr));
    trtableheading.setAttribute("colspan", 3);

    thtime.appendChild(document.createTextNode('Time'));
    threading.appendChild(document.createTextNode('Reading'));

    trcolheadings.appendChild(thtime);
    trcolheadings.appendChild(threading);
    newtablehead.appendChild(trtableheadingrow);
    newtablehead.appendChild(trcolheadings);
    newtable.appendChild(newtablehead);
    newtable.appendChild(newtablebody);
    this.tablediv.appendChild(newtable);

    return newtablebody;
  }

  tableRow(newtablebody, timestr, measstr) {
    var rowelement = document.createElement('tr');
    var dtelement = document.createElement('td');
    var yelement = document.createElement('td');
    var dttext = document.createTextNode(timestr);
    var ytext = document.createTextNode(measstr);

    dtelement.appendChild(dttext);
    yelement.appendChild(ytext);

    rowelement.appendChild(dtelement);
    rowelement.appendChild(yelement);

    newtablebody.appendChild(rowelement);
  }

  update(modeldata) {
    var index;
    var tablelist = document.getElementsByTagName("table");
    var newtablebody = null;

    if (modeldata.capsamples == null) {
      return;
    }

    // Remove all tables.
    for (index = tablelist.length - 1; index >= 0; index--) {
      tablelist[index].parentNode.removeChild(tablelist[index]);
    }

    var prevdatestr = '';
    for (let sample of modeldata.capsamples.samples) {
      var timestamp = sample['timestamp']+'Z';
      var tsMoment = moment(timestamp).tz(modeldata.tz);
      var datestr = tsMoment.format('dddd MMMM Do YYYY');
      var timestr = tsMoment.format('hh:mm');
      var measstr = sample[modeldata.sensor].toFixed(2);


      if (datestr != prevdatestr) {
        newtablebody = this.tableHeader(datestr);
        prevdatestr = datestr;
      }

      this.tableRow(newtablebody, timestr, measstr);
    }
  }
}
