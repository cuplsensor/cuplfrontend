import React from "react";
import {Redirect, withRouter } from "react-router-dom";
import {
    BasePage,
    BulmaField,
    BulmaControl,
    BulmaLabel,
    BulmaInput,
    BulmaSubmit,
    ErrorMessage,
    handleDismiss, BulmaCheckbox, BulmaRadio
} from "./BasePage.jsx";

export class TagConfigForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {serial: '',
                  baseurl: window.location.host,
                  smplintervalmins: 10,
                  secretkey: '',
                  usehmac: true,
                  minbatv: 2200,
                  usehttps: (window.location.protocol === 'https:'),
                  tagformat: "1",
                  redirect: false,
                  error: false};

    this.handleDismiss = handleDismiss.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      let serial = "";
      let secretkey = "";

      if ((prevProps.tag == null) && (this.props.tag)) {
            serial = this.props.tag.serial;
            secretkey = this.props.tag.secretkey;
            this.setState({serial: serial, secretkey: secretkey}, this.createConfigList);
      }
  }

  handleRadioChange(event) {
    this.setState({[event.target.name]: event.target.value}, this.createConfigList);
  }

  handleCheckChange(event) {
    this.setState({[event.target.id]: event.target.checked}, this.createConfigList);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value}, this.createConfigList);
  }

  createConfigList() {
    var configlist = [];

    if (this.state.serial.length === 8) {
      configlist.push(this.createConfigLine('w', this.state.serial));                     // Serial
    }
    configlist.push(this.createConfigLine('h', this.state.usehttps ? '1':'0'));           // HTTPS
    configlist.push(this.createConfigLine('b', this.state.baseurl));                      // Append Base URL
    configlist.push(this.createConfigLine('f', this.state.tagformat));          // Append version string
    configlist.push(this.createConfigLine('t', this.state.smplintervalmins.toString()));  // Append the sample interval string
    configlist.push(this.createConfigLine('u', this.state.minbatv.toString()))
    configlist.push(this.createConfigLine('i', this.state.usehmac ? '1':'0'));            // Append use HMAC
    if (this.state.usehmac && (this.state.secretkey.length === 16)) {
      // Append secret key
      configlist.push(this.createConfigLine('s', this.state.secretkey));                  // Append secret key
    }

    this.props.onConfigChange(configlist);
  }

  createConfigLine(key, value) {
    var cline = '<' + key + ':' + value + '>';
    return cline;
  }

  render() {
      const error = this.state.error;

      return (
          <div className="block">
            <ErrorMessage error={error} handleDismiss={this.handleDismiss} />
            <form onSubmit={this.handleSubmit}>
            <BulmaField>
                <BulmaControl>
                    <BulmaLabel><a href="https://cupltag.readthedocs.io/en/latest/docs/firmware/configuration.html#id1">Serial</a></BulmaLabel>
                    <BulmaInput id="serial" type="text" value={this.state.serial} changeHandler={this.handleChange} />
                </BulmaControl>
            </BulmaField>
            <div className="field is-grouped">
                <BulmaControl>
                    <BulmaLabel><a href="https://cupltag.readthedocs.io/en/latest/docs/firmware/configuration.html#base-url">Base URL</a></BulmaLabel>
                    <BulmaInput id="baseurl" type="text" value={this.state.baseurl} changeHandler={this.handleChange} />
              </BulmaControl>
                <BulmaControl>
                    <BulmaLabel><a href="https://cupltag.readthedocs.io/en/latest/docs/firmware/configuration.html#use-https">Use HTTPS</a></BulmaLabel>
                    <BulmaCheckbox id="usehttps" name="usehttps" type="checkbox" value={this.state.usehttps || false} changeHandler={this.handleCheckChange} />
                </BulmaControl>
            </div>
            <div className="field is-grouped">
               <BulmaControl>
                   <BulmaLabel><a href="https://cupltag.readthedocs.io/en/latest/docs/firmware/configuration.html#hmac-secret-key">HMAC Secret Key</a></BulmaLabel>
                    <BulmaInput id="secretkey" type="text" value={this.state.secretkey} changeHandler={this.handleChange} />
               </BulmaControl>
                <BulmaControl>
                    <BulmaLabel><a href="https://cupltag.readthedocs.io/en/latest/docs/firmware/configuration.html#use-hmac">Use HMAC</a></BulmaLabel>
                    <BulmaCheckbox id="usehmac" name="usehmac" type="checkbox" value={this.state.usehmac || false} changeHandler={this.handleCheckChange} />
                </BulmaControl>
            </div>
                <div className="field is-grouped">
                          <BulmaControl>
                              <BulmaLabel>Tag Format</BulmaLabel>
                              <label className="radio">Temperature &amp; Relative Humidity
                                  <BulmaRadio name="tagformat" type="radio" value="1" checked={this.state.tagformat === "1"} changeHandler={this.handleRadioChange} />
                              </label>
                              <label className="radio">Temperature Only
                                  <BulmaRadio name="tagformat" type="radio" value="2" checked={this.state.tagformat === "2"} changeHandler={this.handleRadioChange} />
                              </label>
                          </BulmaControl>
                      </div>
                <BulmaField>
                    <BulmaControl>
                        <BulmaLabel><a href="https://cupltag.readthedocs.io/en/latest/docs/firmware/configuration.html#sample-interval-in-minutes">Sample Interval (minutes)</a></BulmaLabel>
                        <BulmaInput id="smplintervalmins" type="text" value={this.state.smplintervalmins || ""} changeHandler={this.handleChange} />
                    </BulmaControl>
                </BulmaField>
                <BulmaField>
                    <BulmaControl>
                        <BulmaLabel>Minimum Battery Voltage (mV)</BulmaLabel>
                        <BulmaInput id="minbatv" type="text" value={this.state.minbatv || ""} changeHandler={this.handleChange} />
                    </BulmaControl>
                </BulmaField>
          </form>
          </div>
      );
  }
}