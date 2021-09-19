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

import React from "react";
import {TagConfigForm} from "./TagConfigForm";

export class ConfigNFC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {configliststr: ''};

    this.handleWriteClick = this.handleWriteClick.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
  }

  handleConfigChange(configlist) {
      var configliststr = "";
      for (var configstr of configlist) {
          configliststr += configstr;
      }
      this.setState({configlist: configlist, configliststr: configliststr});
  }

  handleCopyClick() {
      var dummy = document.createElement("textarea");
      // to avoid breaking orgain page when copying more words
      // cant copy when adding below this code
      // dummy.style.display = 'none'
      document.body.appendChild(dummy);
      //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
      dummy.value = this.state.configliststr;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
  }

  handleWriteClick() {
      if ('NDEFReader' in window) {
          /* Scan and write NFC tags */
          const configliststr = this.state.configliststr;
          alert('Tap cuplTag to update configuration.');
          /* The line below prevents build error in ReactJS because NDEFReader cannot be found. */
          /*global NDEFReader*/
          const ndef = new NDEFReader();
          ndef.write(configliststr).then(() => {
              const msgwriteokstr = "Configuration updated. Wait 1 minute or RESET.";
              alert(msgwriteokstr);
              console.log(msgwriteokstr);
            }).catch(error => {
              const msgwritefailstr = `Write failed :-( try again: ${error}.`;
              alert(msgwritefailstr);
              console.log(msgwritefailstr);
            });
      } else {
          alert('Chrome 89+ on Android required.');
      }
  }

  render() {
      return (
          <>
                <TagConfigForm tag={this.props.tag} onConfigChange={this.handleConfigChange} admin={this.props.admin}/>
                  <div className="block">
                      <pre>
                          <code>
                              {this.state.configliststr}
                          </code>
                      </pre>
                  </div>
                  <div className="block">
                      <div className="field is-grouped">
                          <p className="control">
                              <button onClick={this.handleCopyClick} className="button">Copy to Clipboard</button>
                          </p>
                          <p className="control">
                              <button onClick={this.handleWriteClick} className="button">Write with WebNFC</button>
                          </p>
                      </div>
                  </div>
          </>
  );
    }
}