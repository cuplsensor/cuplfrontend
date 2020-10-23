import {BulmaControl, BulmaField, BulmaInput, BulmaLabel} from "./BasePage";
import React from "react";
import {DateTime} from "luxon";

export function WebhookForm(props) {
    const disable_secretkey = props.disable_secretkey || false;

    return(
      <form onSubmit={props.handleSubmit}>
          <BulmaField>
              <BulmaControl>
                  <BulmaLabel>Address</BulmaLabel>
                  <BulmaInput id="address" type="text" value={props.webhook_address} readOnly={props.webhook_set} changeHandler={props.handleChange}/>
              </BulmaControl>
          </BulmaField>
          <BulmaField>
              <BulmaControl>
                  <BulmaLabel>Fields</BulmaLabel>
                  <BulmaInput id="fields" type="text" value={props.webhook_fields} readOnly={props.webhook_set} changeHandler={props.handleChange} />
              </BulmaControl>
          </BulmaField>
          <BulmaField>
              <BulmaControl>
                  <BulmaLabel>HMAC256 Secretkey</BulmaLabel>
                  <BulmaInput id="wh_secretkey" type={disable_secretkey ? "password" : "text"} value={disable_secretkey ? "xxxxxxxxxxxxxxx" : props.webhook_secretkey} disabled={disable_secretkey} readOnly={props.webhook_set} changeHandler={props.handleChange} />
              </BulmaControl>
          </BulmaField>
          <CreatedOn created_on={props.webhook_created_on} />
          <FormButton webhook_set={props.webhook_set} />
          {/* https://jsfiddle.net/ndebellas/y4dLcqkx/ */}
      </form>
    );
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