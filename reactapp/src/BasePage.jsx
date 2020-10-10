import React from "react";
import {Link} from "react-router-dom";

export class BasePage extends React.Component {
  constructor(props) {
    super(props);

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

  handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
  }
}


export function BulmaField(props) {
  return (
      <div className="field">
        {props.children}
      </div>
  );
}

export function BulmaControl(props) {
  return (
      <div className="control">
        {props.children}
      </div>
  );
}

export function BulmaSubmit(props) {
  return (
        <input className="button is-link" type="submit" value={props.value} />
      );
}

export function BulmaInput(props) {
  return (
    <input className="input" id={props.id} type={props.type} value={props.value} onChange={props.changeHandler} />
  );
}

export function BulmaCheckbox(props) {
  return (
    <input className="checkbox" id={props.id} type={props.type} checked={props.value} onChange={props.changeHandler} />
  );
}

export function BulmaRadio(props) {
  return (
    <input className="radio" value={props.value} name={props.name} id={props.id} type={props.type} checked={props.checked} onChange={props.changeHandler} />
  );
}

export function BulmaLabel(props) {
  return (
    <label className="label">
      {props.children}
    </label>
  );
}

export function Section(props) {
  return (
    <section className="section">
      <div className="container">
        {props.children}
      </div>
    </section>
  );
}

export function ErrorMessage(props) {
  const error = props.error;
  if (error) {
    return (
        <div className="notification is-danger is-light">
            {error.message}
        </div>
    );
  }
  else {
      return ("");
  }
}

export function Footer() {
  return (
  <div className="footer pt-3 pb-4">
    <div className="container">
      <nav className="level">
        <div className="level-left">
          <div className="level-item mr-1">
            <a href="https://github.com/cuplsensor/wsfrontend">cuplfrontend</a>
          </div>
          <div className="level-item">
            by Plotsensor Ltd.
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <a href="https://github.com/cuplsensor/wsfrontend/blob/master/LICENSE">Licence</a>
          </div>
          <div className="level-item">
            <a href="/version">Version</a>
          </div>
          <div className="level-item">
            <a href="https://wsfrontend.readthedocs.io/en/latest/index.html#index">Docs</a>
          </div>
        </div>

      </nav>
    </div>
  </div>
  );
}

export function Header(props) {
  return <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="container">
            <div className="navbar-brand">
                    <div className="navbar-item ">
                        <div className="flex">
                            <div className="item">
                                <div className="inline-block">
                                  <Link to="/">
                                    cupl
                                  </Link>

                                </div>
                            </div>
                            <div className="item">
                                <div className="inline-block">{props.bc}
                                </div>
                            </div>
                        </div>
                    </div>
                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
           </div>

      {props.children}
    </div>
  </nav>
}

