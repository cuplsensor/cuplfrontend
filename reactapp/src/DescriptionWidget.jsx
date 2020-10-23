import React from "react";
import {BulmaInput} from "./BasePage";
import {getCookie, handleErrors, putData} from "./api";


export class DescriptionWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {'showedit': false, 'newdesc': ''};

        this.editClickHandler = this.editClickHandler.bind(this);
        this.closeClickHandler = this.closeClickHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    closeClickHandler(event) {
        event.preventDefault();
        this.setState({showedit: false});
    }

    editClickHandler(event) {
        event.preventDefault();
        this.setState({showedit: true, newdesc: this.props.tag.description});
    }

    changeHandler(event) {
        event.preventDefault();
        this.setState({newdesc: event.target.value});
    }

    handleSubmit(event) {
      const tagtoken = getCookie('tagtoken_' + this.props.tag.serial);
      const bearertoken = `Bearer ${tagtoken}`;
      this.setState({showedit: false});
      if (event) {
          event.preventDefault();
      }

      putData('https://b3.websensor.io/api/consumer/tag/' + this.props.tag.serial,
        {'description': this.state.newdesc},
          {'Authorization': bearertoken}
        )
        .then(handleErrors)
        .then(function(response) {
            if (response.status === 204) {
                this.props.submitDone();
            }
        }.bind(this)).catch(error => {
            if (error.code ===401) {
                error.message = error.message + " Invalid token. Scan tag again."
            }
          this.props.submitError(error);
        });

  }


    render() {
        const tagtoken = getCookie('tagtoken_' + this.props.tag.serial);
        return (
            <div>
                <Description clickHandler={this.editClickHandler} tagtoken={tagtoken} description={this.props.tag.description} />
                <DescriptionEditor closeClickHandler={this.closeClickHandler} changeHandler={this.changeHandler} submitHandler={this.handleSubmit} showedit={this.state.showedit} description={this.state.newdesc} />
            </div>
        );
    }
}

function DescriptionEditor(props) {
    return (
        <div className={props.showedit ? 'modal is-active': 'modal'}>
          <div className="modal-background" onClick={props.closeClickHandler}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Edit Description</p>
                    <button className="delete" aria-label="close" onClick={props.closeClickHandler}></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={props.closeClickHandler}>
                        <BulmaInput id="desc" type="text" value={props.description} changeHandler={props.changeHandler} />
                    </form>

                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={props.submitHandler}>Save</button>
                    <button className="button" onClick={props.closeClickHandler}>Cancel</button>
                </footer>
            </div>
       </div>
    );
}

function Description(props) {
    if (props.description || props.tagtoken) {
        return(
            <div className="container mt-5">
                <p><DescriptionLabel clickHandler={props.clickHandler} tagtoken={props.tagtoken}/> {props.description} </p>
            </div>
        );
    } else {
        return('');
    }
}

function DescriptionLabel(props) {
    if (props.tagtoken) {
        return(<a href='#' onClick={props.clickHandler}>Edit Description:</a>)
    } else {
        return("Description:");
    }
}