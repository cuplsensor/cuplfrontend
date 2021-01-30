/*
 * Copyright (c) 2021. Plotsensor Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
        const timestamp = DateTime.fromISO(props.created_on).toLocaleString(DateTime.DATETIME_FULL);
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