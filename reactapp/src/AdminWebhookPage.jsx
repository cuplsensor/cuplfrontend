import AdminTagPage, {AdminTagBC, AdminTagMenu} from "./AdminTagPage";
import {GetAdminToken, postData, deleteData, getData, handleErrors} from "./api";
import {AdminPage, RedirectToLogin} from "./AdminPage";
import {
    BulmaControl,
    Section,
    BulmaLabel,
    BulmaInput,
    BulmaField,
    BulmaSubmit
} from "./BasePage";
import React from "react";
import {Redirect, withRouter} from "react-router-dom";
import {DateTime} from "luxon";


class AdminWebhookPage extends React.Component {
  constructor(props) {
    super(props);
    const frontendurl = window.location.origin;

    GetAdminToken.call(this);

    this.state = {
              tag: {webhook: {address:'', fields:'', wh_secretkey:''}}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
      const admintoken = this.admintoken;
      const tagid = this.props.match.params.id;
      const bearertoken = `Bearer ${admintoken}`;
      getData('https://b3.websensor.io/api/admin/tag/' + tagid,
        {'Authorization': bearertoken }
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            var webhook_set;
            if (json['webhook']) {
              webhook_set = true;
              json['webhook']['address'] = json['webhook']['address'] || "";
              json['webhook']['fields'] = json['webhook']['fields'] || "";
              json['webhook']['wh_secretkey'] = json['webhook']['wh_secretkey'] || "";
              json['webhook']['created_on'] = json['webhook']['created_on'];
            } else {
                webhook_set = false;
                json['webhook'] = {};
                json['webhook']['address'] = "";
                json['webhook']['fields'] = "";
                json['webhook']['wh_secretkey'] = "";
            }
            this.setState({
              tag: json,
              webhook_set: webhook_set
            });
        },
        (error) => {
          this.setState({error});
        });
  }

  deleteWebhook() {
        const admintoken = this.admintoken;
        const bearertoken = `Bearer ${admintoken}`;
        const webhook_id = this.state.tag.webhook.id;
        deleteData('https://b3.websensor.io/api/admin/webhook/' + webhook_id,
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

  postWebhook() {
      const tagid = this.state.tag.id;
      const admintoken = this.admintoken;
      const bearertoken = `Bearer ${admintoken}`;

      var data = {'tag_id': tagid,
                  'address': this.state.tag.webhook.address};
      if (this.state.tag.webhook.fields !== "") {
          data['fields'] = this.state.tag.webhook.fields;
      }
      if (this.state.wh_secretkey !== "") {
          data['wh_secretkey'] = this.state.tag.webhook.wh_secretkey;
      }

      postData('https://b3.websensor.io/api/admin/webhooks',
                    data,
          {'Authorization': bearertoken}
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
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
      if (this.state.webhook_set === false) {
          this.postWebhook();
      } else {
          this.deleteWebhook();
      }

  }

  handleChange(event) {
      var tag = this.state.tag;
      tag['webhook'][event.target.id] = event.target.value;
      this.setState({tag: tag});
  }


    render() {
      const tagid = this.props.match.params.id;
      const activetab = 'Webhook';
      const error = this.state.error;
      const webhook_address = this.state.tag.webhook.address;
      const webhook_fields = this.state.tag.webhook.fields;
      const webhook_secretkey = this.state.tag.webhook.wh_secretkey;
      const webhook_created_on = this.state.tag.webhook.created_on;
      const webhook_set = this.state.webhook_set;


      if (error) {
          if (error.message === "UNAUTHORIZED") {
              return <RedirectToLogin error={error} />
          }
      }

      return (
          <AdminPage bc={<AdminTagWebhookBC tagid={tagid} />} menu={<AdminTagMenu tagid={tagid} activetab={activetab} />}>
              <Section>
              <form onSubmit={this.handleSubmit}>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Address</BulmaLabel>
                              <BulmaInput id="address" type="text" value={webhook_address} readOnly={webhook_set} changeHandler={this.handleChange}/>
                          </BulmaControl>
                      </BulmaField>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Fields</BulmaLabel>
                              <BulmaInput id="fields" type="text" value={webhook_fields} readOnly={webhook_set} changeHandler={this.handleChange } />
                          </BulmaControl>
                      </BulmaField>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>HMAC256 Secretkey</BulmaLabel>
                              <BulmaInput id="wh_secretkey" type="text" value={webhook_secretkey} readOnly={webhook_set} changeHandler={this.handleChange} />
                          </BulmaControl>
                      </BulmaField>
                      <CreatedOn created_on={webhook_created_on} />
                      <FormButton webhook_set={webhook_set} />
                      {/* https://jsfiddle.net/ndebellas/y4dLcqkx/ */}
              </form>
              </Section>
          </AdminPage>);
  }
}

function CreatedOn(props) {
    if (props.created_on) {
        const timestamp = DateTime.fromISO(props.created_on).toLocaleString(DateTime.DATETIME_MED);
        return (
            <BulmaField>
              <BulmaControl>
                  <BulmaLabel>Created On (UTC)</BulmaLabel>
                  <BulmaInput id="created_on" type="text" value={timestamp} readOnly={true} />
              </BulmaControl>
            </BulmaField>
        );
    } else {
        return('');
    }
}

function FormButton(props) {
    if (props.webhook_set) {
        return (
            <input className="button is-danger" type="submit" value="Delete" />
        );
    } else {
        return (
            <input className="button is-success" type="submit" value="Create" />
        );
    }

}

function AdminTagWebhookBC(props) {
    return(
        <AdminTagBC tagid={props.tagid}>
            <li className="is-active"><a href="#" aria-current="page">Webhook</a></li>
        </AdminTagBC>
    );
}


export default withRouter(AdminWebhookPage);