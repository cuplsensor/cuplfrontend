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
                <MenuListElement name="Program" url={'/admin/tag/' + props.tagid + '/program'} active={props.activetab}/>
                <MenuListElement name="Configure (serial)" url="/admin/tags" active={props.activetab}/>
                <MenuListElement name="Configure (NFC)" url="/admin/captures" active={props.activetab}/>
                <MenuListElement name="Simulate" url={'/admin/tag/' + props.tagid + '/simulate'} active={props.activetab}/>
                <MenuListElement name="Captures" url={'/admin/tag/' + props.tagid + '/captures'} active={props.activetab}/>
                <MenuListElement name="Webhook" url={'/admin/tag/' + props.tagid + '/webhook'} active={props.activetab}/>
            </ul>
        </div>
    );
}


