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
import {Redirect, withRouter } from "react-router-dom";
import {
    BulmaField,
    BulmaControl,
    BulmaLabel,
    BulmaInput,
    BulmaSubmit,
    ErrorMessage,
    handleDismiss
} from "./BasePage.jsx";
import {postData, handleErrors} from "./api.js";
import Cookies from 'universal-cookie';



class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    var error = false;

    if (this.props.location.state)
    {
        error = this.props.location.state.error;
    }
    this.state = {client_id: '', client_secret: '', redirect: false, error: error};

    this.handleDismiss = handleDismiss.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleRadioChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleCheckChange(event) {
    this.setState({[event.target.id]: event.target.checked});
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }



  extractBody(response) {
      return response.body();
  }

  handleSubmit(event) {
    postData(process.env.REACT_APP_WSB_ORIGIN + '/api/admin/token',
        {'client_id': this.state.client_id, 'client_secret': this.state.client_secret})
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            const cookies = new Cookies();
            cookies.set('admintoken', json['token'], {path: '/', sameSite: 'strict'});
            this.setState({redirect: true});
        },
        (error) => {
          this.setState({error});
        });
    event.preventDefault();
  }

  render() {
      const error = this.state.error;
      const redirect = this.state.redirect;
      const referrer = (this.props.location.state === undefined) ? '/admin/tags' : this.props.location.state.referrer;
      if (redirect === true) {
          return <Redirect to={referrer} />
      }
      return (
          <div>
            <ErrorMessage error={error} handleDismiss={this.handleDismiss} />
            <form onSubmit={this.handleSubmit}>
            <BulmaField>
              <BulmaLabel>client_id</BulmaLabel>
              <BulmaControl>
                <BulmaInput id="client_id" type="text" value={this.state.client_id} changeHandler={this.handleChange} />
              </BulmaControl>
            </BulmaField>
            <BulmaField>
              <BulmaLabel>client_secret</BulmaLabel>
              <BulmaControl>
                <BulmaInput id="client_secret" type="password" value={this.state.client_secret} changeHandler={this.handleChange} />
              </BulmaControl>
            </BulmaField>
            <BulmaField>
              <BulmaControl>
                <BulmaSubmit value="Log in" />
              </BulmaControl>
            </BulmaField>
          </form>
          </div>
      );
  }
}

export default withRouter(LoginForm);