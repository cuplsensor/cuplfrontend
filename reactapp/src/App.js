import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import BasePage from "./BasePage";
import './App.css';

function App() {
  return (
   <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <BasePage><Section>a</Section></BasePage>;
}

function Admin() {
  return <BasePage>
            <Section>
              <h4>Sign in</h4>
              <LoginForm />
            </Section>
        </BasePage>;
}

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {client_id: '', client_secret: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    postData('https://b3.websensor.io/api/admin/token',
        {'client_id': this.state.client_id, 'client_secret': this.state.client_secret})
        .then(response => {
            if(response.status >= 400) {
                // Display error message.
                this.setState({
                   error: "eaa"
                });
            }
        }, // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            error
          });
        });
    event.preventDefault();
  }

  render() {
      const error = this.state.error;
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

function ErrorMessage(props) {
          const error = props.error;
          if (error) {
            return (
                <div className="notification is-danger is-light">
                    Error: {error.message}
                </div>
            );
          }
          else {
              return ("");
          }
}

function BulmaField(props) {
  return (
      <div className="field">
        {props.children}
      </div>
  );
}

function BulmaControl(props) {
  return (
      <div className="control">
        {props.children}
      </div>
  );
}

function BulmaSubmit() {
  return (
        <input className="button is-link" type="submit" value="Log in" />
      );
}

function BulmaInput(props) {
  return (
    <input className="input" id={props.id} type={props.type} value={props.value} onChange={props.changeHandler} />
  );
}

function BulmaLabel(props) {
  return (
    <label className="label">
      {props.children}
    </label>
  );
}

function Section(props) {
  return (
    <section className="section">
      <div className="container">
        {props.children}
      </div>
    </section>
  );
}

function NoMatch() {
  let location = useLocation();

  return (
    <BasePage>
      <Section>
        <h3>
          Error 404: No match for <code>{location.pathname}</code>
        </h3>
      </Section>
    </BasePage>
  );
}




export default App;
