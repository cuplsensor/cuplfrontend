import React from "react";
import {AdminPage, AdminMenu, AdminBC} from "./AdminPage"
import {withRouter} from "react-router-dom";
import {AdminCapturesList} from "./AdminCapturesList";


export function AdminCapturesListPage(props) {
    return(
          <AdminPage bc={<AdminBC />} menu={<AdminMenu activetab='captures' />}>
            <AdminCapturesList {...props} />
          </AdminPage>
      );
}

export default withRouter(AdminCapturesListPage);


