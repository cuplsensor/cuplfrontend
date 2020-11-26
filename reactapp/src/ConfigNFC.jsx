import React from "react";
import {TagConfigForm} from "./TagConfigForm";

export class ConfigNFC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {configliststr: ''};

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
                      <button onClick={this.handleCopyClick} className="button">Copy to Clipboard</button>
                  </div>
          </>
  );
    }
}