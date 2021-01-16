import React from "react";
import {AdminPage, AdminMenu, AdminBC} from "./AdminPage"
import {Link, withRouter} from "react-router-dom";
import {AdminResourceTable} from "./AdminResourceTable";
import {DateTime} from "luxon";

function AdminCapturesBC(props) {
    return(
        <AdminBC>
            <li className="is-active"><a href="#" aria-current="page">Captures</a></li>
        </AdminBC>
    );
}

export function AdminCapturesListPage(props) {
    return(
          <AdminPage bc={<AdminCapturesBC />} menu={<AdminMenu activetab='captures' />}>
            <AdminResourceTable
                {...props}
                ListItem={CapturesListItem}
                HeaderItem={CapturesHeaderItem}
                url={process.env.REACT_APP_WSB_ORIGIN + '/api/admin/captures'}
            />
          </AdminPage>
      );
}

function FormatHeader() {
    return <a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_42">format</a>
}

function SmplIntervalHeader() {
    return <a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_10">smplintervalmins</a>
}

function LoopcountHeader() {
    return <a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_28">loopcount</a>
}

function ResetsAllTimeHeader() {
    return <a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_29">resetsalltime</a>
}

function BatvoltagemvHeader() {
    return <a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_10">batvoltagemv</a>
}

function ResetCauseHeader() {
    return <a href="https://wscodec.readthedocs.io/en/dev/docs/specification/specs.html#CODEC_SPEC_16">ResetCause</a>
}

function HashHeader() {
    return <a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_24">Hash</a>
}

export function ConsumerCaptureTable(props) {
    if (props['capture'] === null) {
        return "";
    } else {
        const dt = DateTime.fromISO(props['capture']['timestamp']);
        const datestamp = dt.toLocaleString(DateTime.DATE_SHORT);
        const timestamp = dt.toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET);
        return (
            <table className="table">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <td>{props['capture']['id']}</td>
                    </tr>
                    <tr>
                        <th><FormatHeader /></th>
                        <td>{props['capture']['format']}</td>
                    </tr>
                    <tr>
                        <th><SmplIntervalHeader /></th>
                        <td>{props['capture']['timeintmins']}</td>
                    </tr>
                    <tr>
                        <th><LoopcountHeader /></th>
                        <td>{props['capture']['loopcount']}</td>
                    </tr>
                    <tr>
                        <th><ResetsAllTimeHeader /></th>
                        <td>{props['capture']['status']['resetsalltime']}</td>
                    </tr>
                    <tr>
                        <th>cursorpos</th>
                        <td>{props['capture']['cursorpos']}</td>
                    </tr>
                    <tr>
                        <th><BatvoltagemvHeader /></th>
                        <td>{props['capture']['batvoltagemv']}</td>
                    </tr>
                    <tr>
                        <th><ResetCauseHeader /></th>
                        <td><ResetCause resource={props['capture']} /></td>
                    </tr>
                    <tr>
                        <th><HashHeader /></th>
                        <td>{props['capture']['hash']}</td>
                    </tr>
                    <tr>
                        <th>Date created</th>
                        <td>{datestamp}</td>
                    </tr>
                    <tr>
                        <th>Time created</th>
                        <td>{timestamp}</td>
                    </tr>
                </tbody>
            </table>
        );
    }

}

function CapturesHeaderItem() {
    return(
        <tr>
            <th>ID</th>
            <th>Parent Tag</th>
            <th><FormatHeader /></th>
            <th><SmplIntervalHeader /></th>
            <th><LoopcountHeader /></th>
            <th><ResetsAllTimeHeader /></th>
            <th>cursorpos</th>
            <th><BatvoltagemvHeader /></th>
            <th><ResetCauseHeader /></th>
            <th><HashHeader /></th>
            <th>Date Created</th>
            <th>Time Created</th>
            <th></th>
        </tr>
        );
}

function ResetCause(props) {
    const bor       = props.resource['status']['brownout'] ? <p><a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_31">BOR</a>,</p> : null;
    const clockfail = props.resource['status']['clockfail'] ? <p><a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_36">CLOCKFAIL</a>,</p> : null;
    const lpm5wu    = props.resource['status']['lpm5wakeup'] ? <p><a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_35">LPM5WU</a>,</p> : null;
    const misc      = props.resource['status']['misc'] ? <p><a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_34">MISC</a>,</p> : null;
    const svsh      = props.resource['status']['supervisor'] ? <p><a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_32">SVSH</a>,</p> : null;
    const wdt       = props.resource['status']['watchdog'] ? <p><a href="https://wscodec.readthedocs.io/en/dev/docs/specification/features.html#CODEC_FEAT_33">WDT</a>,</p> : null;
    var resetcause = "--";

    if (bor || clockfail || lpm5wu || misc || svsh || wdt) {
        resetcause = <>{bor} {clockfail} {lpm5wu} {misc} {svsh} {wdt}</>;
    }

    return resetcause;
}

function CapturesListItem(props) {
      const dtUTC = DateTime.fromISO(props.resource['timestamp']).setZone('utc');
      const datestamp = dtUTC.toLocaleString(DateTime.DATE_SHORT);
      const timestamp = dtUTC.toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET);
      console.log(props.resource);
      return (
        <tr>
            <td>{props.resource['id']}</td>
            <td><Link to={"/admin/tag/" + props.resource['parent_tag']}>{props.resource['parent_tag']}</Link></td>
            <td>{props.resource['format']}</td>
            <td>{props.resource['timeintmins']}</td>
            <td>{props.resource['loopcount']}</td>
            <td>{props.resource['status']['resetsalltime']}</td>
            <td>{props.resource['cursorpos']}</td>
            <td>{props.resource['batvoltagemv']}</td>
            <td><ResetCause resource={props.resource} /></td>
            <td>{props.resource['hash']}</td>
            <td>{datestamp}</td>
            <td>{timestamp}</td>
            <td><a href="#" onClick={() => props.deleteFcn(process.env.REACT_APP_WSB_ORIGIN + '/api/admin/capture/' + props.resource['id'])}>Delete</a></td>
        </tr>
      );
  }

export default withRouter(AdminCapturesListPage);


