import {AdminPage, ListElement, MenuListElement, RedirectToLogin} from "./AdminPage";
import {getData, postData} from "./api";
import React from "react";
import {AdminBC} from "./AdminPage"
import {Redirect, withRouter} from "react-router-dom";


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


