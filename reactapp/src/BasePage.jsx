import React from "react";
import {Link, Redirect} from "react-router-dom";
import logo from './logo.svg';


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
  var readOnly = false;
  var disabled = false;
  if (props.readOnly) {
      readOnly = true;
  }
  if (props.disabled) {
      disabled = true;
  }
  return (
    <input className="input" id={props.id} type={props.type} value={props.value} disabled={disabled} onChange={props.changeHandler} readOnly={readOnly} />
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

export function CaptureErrorMessage(props) {
    const error = props.error;
    if (error == null) {
        return (
          <ErrorMessage error={error}/>
        );
    }
    else if ((error.code === 404) && (error.url === 'https://b3.websensor.io/api/consumer/captures/' + props.id)) {
        return (
            <Redirect to={`/error/404/capture/${props.id}`} />
        );
    } else {
        return (
          <ErrorMessage error={error}/>
        );
    }
}

export function TagErrorMessage(props) {
    const error = props.error;
    if (error == null) {
        return (
          <ErrorMessage error={error} handleDismiss={props.handleDismiss} />
        );
    }
    else if ((error.code === 404) && (error.url === 'https://b3.websensor.io/api/consumer/tag/' + props.serial)) {
        return (
            <Redirect to={`/error/404/tag/${props.serial}`} />
        );
    } else {
        return (
          <ErrorMessage error={error} handleDismiss={props.handleDismiss} />
        );
    }
}

export function handleDismiss() {
    this.setState({error: null});
}

function toggleMessageBody(event) {
    var mb = document.getElementsByClassName("message-body")[0];

    if (mb.classList.contains("is-hidden")) {
        mb.classList.remove("is-hidden");
        event.target.text = "Show Less"
    } else {
        mb.classList.add("is-hidden");
        event.target.text = "Show More"
    }
}

export function ErrorMessage(props) {
  const error = props.error;

  if (error) {
      if (error.text) {
          return (
          <article className="message is-danger is-light">
              <div className="message-header">
                  <p>{error.message} <a id="showmore" href='#' onClick={toggleMessageBody}>Show More</a></p>

                  <button onClick={props.handleDismiss} className="delete" aria-label="delete" />
              </div>
              <div className="message-body is-hidden">
                  <pre>
                    <code>
                        {JSON.stringify(error.text, null, 4) }
                    </code>
                </pre>
              </div>
          </article>);
      } else {
          return (
            <div className="notification is-danger is-light">
                {error.message}
            </div>
        );
      }

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

                                      <a href="/" className="button is-white" style={{backgroundImage: `url(${logo})`,
                                               backgroundRepeat: "no-repeat",
                                               backgroundPosition: "center",
                                               width: "45px",
                                               backgroundSize: "100%",

                                               marginTop: "0.35em"


                                    }}></a>
                                  </Link>

                                </div>
                            </div>
                            <div className="item">
                                <div className="inline-block">{props.bc}
                                </div>
                            </div>
                        </div>
                    </div>
                <a role="button" className={props.burgerVisible ? "navbar-burger is-active" : "navbar-burger"} onClick={props.burgerClickHandler} aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
           </div>

      {props.children}
    </div>
  </nav>
}

