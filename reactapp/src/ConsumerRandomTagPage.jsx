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
import {Redirect, withRouter} from "react-router-dom";
import {getData, handleErrors} from "./api.js";


class ConsumerRandomTagPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {'error': false, 'serial': ''};
  }

  componentDidMount() {
    getData(process.env.REACT_APP_WSB_ORIGIN + '/api/consumer/random/tag',
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({serial: json['serial']})
        },
        (error) => {
          this.setState({error: error});
        });
  }

  render() {
      const error = this.state.error;

      if (this.state.serial) {
          return(
            <Redirect to={"/tag/" + this.state.serial} />
          );
      }
      return ('');
  }
}


export default withRouter(ConsumerRandomTagPage);