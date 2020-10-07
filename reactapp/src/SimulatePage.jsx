import AdminTagPage from "./AdminTagPage";
import {getData} from "./api";
import {AdminPage} from "./AdminPage";
import {BulmaControl, Section, BulmaLabel, BulmaInput, BulmaCheckbox, BulmaRadio} from "./BasePage";
import React from "react";
import {withRouter} from "react-router-dom";
var QRCode = require('qrcode.react');


class SimulatePage extends AdminPage {
  constructor(props) {
    super(props);
    const frontendurl = window.location.origin;

    this.submitOnChange = true;


    this.state = {
              tag: null,
              simulateurl: '',
              activesubtab: 'Simulate',
              frontendurl: frontendurl,
              nsamples: 100,
              smplintervalmins: 10,
              batvoltagemv: 2200,
              usehmac: false,
              tagerror: false,
              tagformat: "1",
              bor: false,
              svsh: false,
              wdt: false,
              misc: false,
              lpm5wu: false,
              clockfail: false
            };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
      super.componentDidMount();
      const admintoken = this.admintoken;
      const tagid = this.props.match.params.id;
      const bearertoken = `Bearer ${admintoken}`;
      getData('https://b3.websensor.io/api/admin/tag/' + tagid,
        {'Authorization': bearertoken }
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({
              tag: json,
              usehmac: json['usehmac'],
            });
            this.handleSubmit();
        },
        (error) => {
          this.setState({error});
        });
  }

  handleSubmit(event) {
      const tagid = this.state.tag.id;
      const admintoken = this.admintoken;
      const bearertoken = `Bearer ${admintoken}`;
      if (event) {
          event.preventDefault();
      }
      getData('https://b3.websensor.io/api/admin/tag/' + tagid + '/simulate',
        {'Authorization': bearertoken },
        {'frontendurl': this.state.frontendurl,
                'nsamples': this.state.nsamples,
                'smplintervalmins': this.state.smplintervalmins,
                'format': this.state.tagformat,
                'usehmac': this.state.usehmac,
                'batvoltagemv': this.state.batvoltagemv,
                'bor': this.state.bor,
                'svsh': this.state.svsh,
                'wdt': this.state.wdt,
                'misc': this.state.misc,
                'lpm5wu': this.state.lpm5wu,
                'clockfail': this.state.clockfail,
                'tagerror': this.state.tagerror}
        )
        .then(this.handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({'simulateurl': json})
        },
        (error) => {
          this.setState({error});
        });

  }

  handleRadioChange(event) {
    this.setState({[event.target.name]: event.target.value}, this.handleSubmit);
  }

  handleCheckChange(event) {
    this.setState({[event.target.id]: event.target.checked}, this.handleSubmit);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value}, this.handleSubmit);
  }


    render() {
      const error = this.state.error;

      return (
          <AdminTagPage>
              <Section>
              <form onSubmit={this.handleSubmit}>
                      <div className="field is-grouped is-grouped-multiline">
                          <BulmaControl>
                              <BulmaLabel>frontendurl</BulmaLabel>
                              <BulmaInput id="frontendurl" type="text" value={this.state.frontendurl || ""} changeHandler={this.handleChange}/>
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>nsamples</BulmaLabel>
                              <BulmaInput id="nsamples" type="text" value={this.state.nsamples || ""} changeHandler={this.handleChange } />
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>smplintervalmins</BulmaLabel>
                              <BulmaInput id="smplintervalmins" type="text" value={this.state.smplintervalmins || ""} changeHandler={this.handleChange} />
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>batvoltagemv</BulmaLabel>
                              <BulmaInput id="batvoltagemv" type="text" value={this.state.batvoltagemv || ""} changeHandler={this.handleChange} />
                          </BulmaControl>
                      </div>
                      <div className="field is-grouped">
                          <BulmaControl>
                              <label className="radio">Temperature &amp; Relative Humidity
                                  <BulmaRadio name="tagformat" type="radio" value="1" checked={this.state.tagformat === "1"} changeHandler={this.handleRadioChange} />
                              </label>
                              <label className="radio">Temperature Only
                                  <BulmaRadio name="tagformat" type="radio" value="2" checked={this.state.tagformat === "2"} changeHandler={this.handleRadioChange} />
                              </label>
                          </BulmaControl>
                      </div>
                      <div className="field is-grouped is-grouped-multiline">
                          <BulmaControl>
                              <BulmaLabel>bor</BulmaLabel>
                              <BulmaCheckbox id="bor" name="bor" type="checkbox" value={this.state.bor || false} changeHandler={this.handleCheckChange} />
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>svsh</BulmaLabel>
                              <BulmaCheckbox id="svsh" name="svsh" type="checkbox" value={this.state.svsh || false} changeHandler={this.handleCheckChange} />
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>wdt</BulmaLabel>
                              <BulmaCheckbox id="wdt" name="wdt" type="checkbox" value={this.state.wdt || false} changeHandler={this.handleCheckChange} />
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>misc</BulmaLabel>
                              <BulmaCheckbox id="misc" name="misc" type="checkbox" value={this.state.misc || false} changeHandler={this.handleCheckChange} />
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>lpm5wu</BulmaLabel>
                              <BulmaCheckbox id="lpm5wu" name="lpm5wu" type="checkbox" value={this.state.lpm5wu || false} changeHandler={this.handleCheckChange} />
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>clockfail</BulmaLabel>
                              <BulmaCheckbox id="clockfail" name="clockfail" type="checkbox" value={this.state.clockfail || false} changeHandler={this.handleCheckChange} />
                          </BulmaControl>
                      </div>
                      <div className="field">
                          <BulmaControl>
                              <BulmaLabel>usehmac</BulmaLabel>
                              <BulmaCheckbox id="usehmac" type="checkbox" value={this.state.usehmac || false} changeHandler={this.handleCheckChange} />
                          </BulmaControl>
                          <BulmaControl>
                              <BulmaLabel>tagerror</BulmaLabel>
                              <BulmaCheckbox id="tagerror" type="checkbox" value={this.state.tagerror || false} changeHandler={this.handleCheckChange}/>
                          </BulmaControl>
                      </div>
                      <div className="field is-grouped">
                          <BulmaControl>
                              {/* https://jsfiddle.net/ndebellas/y4dLcqkx/ */}
                              <input className="button is-link" type="submit" value="Update"/>
                          </BulmaControl>
                      </div>
              </form>
              </Section>
                <Section>
                  <a href={this.state.simulateurl}>
                      <code style={{'wordWrap': 'break-word'}}>
                        {this.state.simulateurl}
                      </code>
                  </a>
                </Section>
                <Section>
                <QRCode size={500} value={this.state.simulateurl} />
                </Section>

          </AdminTagPage>);

  }
}


export default withRouter(SimulatePage);