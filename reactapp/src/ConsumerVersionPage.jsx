import React from "react";
import {withRouter } from "react-router-dom";
import {ConsumerBasePage} from "./ConsumerPage";


class ConsumerVersionPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
          <ConsumerBasePage bc={<ConsumerVersionBC />}>
              <h5>cuplFrontend</h5>
                <p>Version</p>
              <h5>cuplBackend</h5>
                <p>Detected version</p>
                <p>Recommended version</p>
              <h6>cuplCodec</h6>
                <p>Detected version</p>
                <p>Recommended version</p>
              <h5>cuplTag</h5>
                <p>Recommended version</p>
          </ConsumerBasePage>
      );
  }
}


function ConsumerVersionBC(props) {
    return (
        <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li className="is-active"><a href="#" aria-current="page">Version</a></li>
        </ul>
      </nav>
    );
}

export default withRouter(ConsumerVersionPage);