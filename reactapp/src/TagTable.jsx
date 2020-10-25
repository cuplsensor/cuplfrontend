import React from "react";


export class TagTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let components = [];
        for(const tagserial of this.props.taglist) {
            components.push(
                <TagTableRow key={tagserial} tagserial={tagserial} />
            );
        }
        return(
            <div>
                <h5 className="title is-5 mb-3">{this.props.name}</h5>
                <table className="table">
                    <tbody>
                        {components}
                    </tbody>
                </table>

            </div>
        );
    }
}

function TagTableRow(props) {
    return (
        <tr>
            <td><a href={`tag/${props.tagserial}`}>{props.tagserial}</a></td>
        </tr>
    );
}