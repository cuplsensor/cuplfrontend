import React from "react";
import {Redirect, withRouter} from "react-router-dom";
import {deleteData, getCookie, getData, handleErrors, postData} from "./api.js";
import {ConsumerBasePage} from "./ConsumerPage";
import 'chartjs-adapter-luxon';
import {WebhookForm} from "./WebhookForm";
import {ErrorMessage} from "./BasePage";


class ConsumerWebhookPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {'error': false, webhook: {address:'', fields:'', wh_secretkey:''}, disable_secretkey: false};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
      const tagtoken = getCookie('tagtoken_' + this.props.serial);
      const bearertoken = `Bearer ${tagtoken}`;
      getData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial + '/webhook',
          {'Authorization': bearertoken}
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            var webhook_set;
            if (json) {
              webhook_set = true;
              json['address'] = json['address'] || "";
              json['fields'] = json['fields'] || "";
              json['wh_secretkey'] = "";
              json['created_on'] = json['created_on'];
            } else {
                webhook_set = false;
                json = {};
                json['address'] = "";
                json['fields'] = "";
                json['wh_secretkey'] = "";
            }
            this.setState({
              webhook: json,
              webhook_set: webhook_set,
              disable_secretkey: webhook_set
            });
        },
        (error) => {
          const webhook_set = false;
          const webhook = {};
          webhook['address'] = "";
          webhook['fields'] = "";
          webhook['wh_secretkey'] = "";
          if (error.code===404) {
              error = false;
          }
          this.setState({
              error: error,
              webhook: webhook,
              webhook_set: webhook_set,
              disable_secretkey: webhook_set
            });
        });
  }

  postWebhook() {
      const tagtoken = getCookie('tagtoken_' + this.props.serial);
      const bearertoken = `Bearer ${tagtoken}`;

      var data = {'address': this.state.webhook.address};
      if (this.state.webhook.fields !== "") {
          data['fields'] = this.state.webhook.fields;
      }
      if (this.state.webhook.wh_secretkey !== "") {
          data['wh_secretkey'] = this.state.webhook.wh_secretkey;
      }

      postData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial + '/webhook',
                    data,
          {'Authorization': bearertoken}
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            if (json) {
              json['address'] = json['address'] || "";
              json['fields'] = json['fields'] || "";
              json['wh_secretkey'] = json['wh_secretkey'] || "";
              json['created_on'] = json['created_on'];
              this.setState({
                  webhook: json,
                  webhook_set: true,
                  disable_secretkey: false
              });
            } else {
                this.setState({
                  webhook_set: false,
                  disable_secretkey: false
              });
            }
        },
        (error) => {
          this.setState({error});
        });
  }

  deleteWebhook() {
        const tagtoken = getCookie('tagtoken_' + this.props.serial);
        const bearertoken = `Bearer ${tagtoken}`;

        deleteData('https://b3.websensor.io/api/consumer/tag/' + this.props.serial + '/webhook',
              {'Authorization': bearertoken}
            )
            .then(handleErrors)
            .then(response => {
                this.componentDidMount();
            },
            (error) => {
              this.setState({error});
            });
  }

  handleSubmit(event) {
      if (event) {
          event.preventDefault();
      }
      console.log("a")
      if (this.state.webhook_set === false) {
          this.postWebhook();
      } else {
          this.deleteWebhook();
      }
  }

  handleChange(event) {
      var webhook = this.state.webhook;
      webhook[event.target.id] = event.target.value;
      this.setState({webhook: webhook});
  }

  render() {
      const error = this.state.error;
      var tagserial = this.props.serial;
      var capture_id = "";
      const disable_secretkey = this.state.disable_secretkey;
      const webhook_address = this.state.webhook.address;
      const webhook_fields = this.state.webhook.fields;
      const webhook_secretkey = this.state.webhook.wh_secretkey;
      const webhook_created_on = this.state.webhook.created_on;
      const webhook_set = this.state.webhook_set;

      if (error.code===401) {
          error.message = "UNAUTHORIZED: Invalid token. Scan tag again."
          return <Redirect to={{pathname: "/tag/"+this.props.serial, state: {error: this.state.error}}} />
      } else {
          return (
              <ConsumerBasePage bc={<ConsumerWebhookBC serial={tagserial} />}>
                <ErrorMessage error={error} />
                <WebhookForm
                        handleSubmit={this.handleSubmit}
                        handleChange={this.handleChange}
                        webhook_set={webhook_set}
                        webhook_address={webhook_address}
                        webhook_fields={webhook_fields}
                        webhook_secretkey={webhook_secretkey}
                        webhook_created_on={webhook_created_on}
                        disable_secretkey={disable_secretkey}
                />
              </ConsumerBasePage>
          );
      }
  }
}


function ConsumerWebhookBC(props) {
    return (
      <nav className="breadcrumb is-left is-size-6" aria-label="breadcrumbs">
        <ul>
            <li><a href={`/tag/${props.serial}`}>{props.serial}</a></li>
            <li className="is-active"><a href="#" aria-current="page">Webhook</a></li>
        </ul>
      </nav>
    );
}

export default withRouter(ConsumerWebhookPage);