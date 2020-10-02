import React from "react";
import {Redirect, withRouter } from "react-router-dom";
import {BulmaField, BulmaControl, BulmaLabel, BulmaInput, BulmaSubmit, ErrorMessage} from "./BasePage.jsx";
import {postData} from "./api.js";
import Cookies from 'universal-cookie';



class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {client_id: '', client_secret: '', redirect: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleErrors(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
  }

  extractBody(response) {
      return response.body();
  }

  handleSubmit(event) {
    postData('https://b3.websensor.io/api/admin/token',
        {'client_id': this.state.client_id, 'client_secret': this.state.client_secret})
        .then(this.handleErrors)
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
            <ErrorMessage error={error} />
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
                <BulmaSubmit />
              </BulmaControl>
            </BulmaField>
          </form>
          </div>
      );
  }
}

export default withRouter(LoginForm);