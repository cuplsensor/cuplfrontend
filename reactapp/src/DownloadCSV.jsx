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

import React from "react";
import {tempConverted} from "./BasePage";
import TempUnitContext from "./TempUnitContext";

export class DownloadCSVButton extends React.Component {
    constructor(props) {
        super(props);

        this.download = this.download.bind(this);
    }

    convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = ['time', 'temp', 'rh'];

        result = 'Time (ISO-8601), Time (Excel friendly), Temp deg' + args.tempunit + ', RH %';
        result += lineDelimiter;

        var val;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;
                val = item[key];

                if (val !== null) {
                    if (key === 'temp') {
                        val = tempConverted(val, args.tempunit);
                        val = val.toFixed(1);
                        result += val;
                    }
                    else if (key == 'rh') {
                        val = val.toFixed(0);
                        result += val;
                    } else if (key === 'time') {
                        const valISO = val.toISO();
                        result += valISO + columnDelimiter;
                        const valExcel = val.toFormat('yyyy-MM-dd HH:mm:ss');
                        result += valExcel;
                    }
                }
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    static contextType = TempUnitContext;

    download() {
        var data, filename, link;
        var csv = this.convertArrayOfObjectsToCSV({
            data: this.props.samples,
            tempunit: this.context.unit || "C"
        });
        if (csv == null) return;

        filename = this.props.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    render() {
        return(
          <a link="#" className="button is-text" onClick={this.download}>Download CSV</a>
        );
    }
}