import React from "react";


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

export function BulmaSubmit() {
  return (
        <input className="button is-link" type="submit" value="Log in" />
      );
}

export function BulmaInput(props) {
  return (
    <input className="input" id={props.id} type={props.type} value={props.value} onChange={props.changeHandler} />
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

        <a className="navbar-item" href="/"><h4>plotsensor</h4></a>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false"
           data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>

      </div>

      {props.children}
    </div>
  </nav>
}