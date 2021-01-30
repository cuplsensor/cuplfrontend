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

import {MenuListElement} from "./AdminPage";
import React from "react";
import {AdminBC} from "./AdminPage"

export function AdminTagBC(props) {
    return (
        <AdminBC>
            <li><a href="/admin/tags">Tags</a></li>
            <li className="is-active"><a href="#" aria-current="page">{props.tagid}</a></li>
            {props.children}
        </AdminBC>

    );
}

export function AdminTagMenu(props) {
    return (
        <div>
            <ul className="menu-list">
                <MenuListElement name="Edit" url={'/admin/tag/' + props.tagid + '/edit'} active={props.activetab}/>
                <MenuListElement name="Configure" url={'/admin/tag/' + props.tagid + '/configure'} active={''} children={<AdminConfigSubMenu name="Configure" tagid={props.tagid} activetab={props.activetab}/>} />
                <MenuListElement name="Simulate" url={'/admin/tag/' + props.tagid + '/simulate'} active={props.activetab}/>
                <MenuListElement name="Captures" url={'/admin/tag/' + props.tagid + '/captures'} active={props.activetab}/>
                <MenuListElement name="Webhook" url={'/admin/tag/' + props.tagid + '/webhook'} active={props.activetab}/>
            </ul>
        </div>
    );
}

function AdminConfigSubMenu(props) {
    const isHidden = !((props.activetab.toLowerCase() === "serial") || (props.activetab.toLowerCase() === "nfc"));
    return (
        <div className={isHidden ? "is-hidden" : "is-block"}>
            <ul>
                <MenuListElement name="Serial" url={'/admin/tag/' + props.tagid + '/configure/serial'} active={props.activetab}/>
                <MenuListElement name="NFC" url={'/admin/tag/' + props.tagid + '/configure/nfc'} active={props.activetab}/>
            </ul>
        </div>
    )
}


