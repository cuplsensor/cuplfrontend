import AdminTagPage, {AdminTagBC, AdminTagMenu} from "./AdminTagPage";
import {GetAdminToken, putData, getData, handleErrors} from "./api";
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


class AdminEditPage extends React.Component {
  constructor(props) {
    super(props);
    const frontendurl = window.location.origin;

    GetAdminToken.call(this);

    this.state = {
              tag: '',
              simulateurl: '',
              fwversion: '',
              hwversion: '',
              description: ''
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
            this.setState({
              tag: json,
            });
        },
        (error) => {
          this.setState({error});
        });
  }

  handleSubmit(event) {
      const tagid = this.state.tag.id;
      const admintoken = this.admintoken;
      const bearertoken = `Bearer ${admintoken}`;
      if (event) {
          event.preventDefault();
      }
      putData('https://b3.websensor.io/api/admin/tag/' + tagid,
        {'fwversion': this.state.tag.fwversion,
              'hwversion': this.state.tag.hwversion,
              'description': this.state.tag.description},
          {'Authorization': bearertoken}
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            this.setState({'simulateurl': json})
        },
        (error) => {
          this.setState({error});
        });

  }

  handleChange(event) {
    var tag = this.state.tag;
    tag[event.target.id] = event.target.value;
    this.setState({tag: tag});
  }


    render() {
      const tagid = this.props.match.params.id;
      const activetab = 'Edit';
      const error = this.state.error;
      if (error) {
          if (error.code ===401) {
              return <RedirectToLogin error={error} />
          }
      }
      return (
          <AdminPage bc={<AdminTagEditBC tagid={tagid} />} menu={<AdminTagMenu tagid={tagid} activetab={activetab} />}>
              <Section>
              <form onSubmit={this.handleSubmit}>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Firmware Version</BulmaLabel>
                              <BulmaInput id="fwversion" type="text" value={this.state.tag.fwversion || ""} changeHandler={this.handleChange}/>
                          </BulmaControl>
                      </BulmaField>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Hardware Version</BulmaLabel>
                              <BulmaInput id="hwversion" type="text" value={this.state.tag.hwversion || ""} changeHandler={this.handleChange } />
                          </BulmaControl>
                      </BulmaField>
                      <BulmaField>
                          <BulmaControl>
                              <BulmaLabel>Description</BulmaLabel>
                              <BulmaInput id="description" type="text" value={this.state.tag.description || ""} changeHandler={this.handleChange} />
                          </BulmaControl>
                      </BulmaField>
                      <BulmaSubmit/>
                      {/* https://jsfiddle.net/ndebellas/y4dLcqkx/ */}
              </form>
              </Section>
          </AdminPage>);

  }
}

function AdminTagEditBC(props) {
    return(
        <AdminTagBC tagid={props.tagid}>
            <li className="is-active"><a href="#" aria-current="page">Edit</a></li>
        </AdminTagBC>
    );
}


export default withRouter(AdminEditPage);