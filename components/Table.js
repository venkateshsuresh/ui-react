import Paper from "@material-ui/core/Paper";
import {tableIcons} from "../utils/table_icons";
import MaterialTable from "material-table";
import React from "react";

export default function Table(props) {
    return (
        <MaterialTable
            components={{
                Container: props => (
                    <Paper variant={"outlined"} elevation={0} {...props} />
                )
            }}
            icons={tableIcons}
            options={
                {actionsColumnIndex: -1}
            }
            {...props}
        />
    )
}