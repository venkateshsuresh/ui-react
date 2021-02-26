import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
    table: {

    },
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

function createData(name, value, required) {
    return { name, value, required };
}

const rows = [
    createData('instance_id', "aravind"),
];

export default function ArgumentTable(props) {
    const classes = useStyles();

    const [args, setArgs] = useState({});

    useEffect(() => {
        setArgs(props.arguments);
    }, [props.arguments]);

    return (
        <TableContainer component={Paper} >
            <Table className={classes.table} aria-label="simple table">
                <TableHead color={"black"}>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell align="right">Value</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(args).map((key) => (
                        <TableRow key={key}>
                            <TableCell component="th" scope="row">
                                {key}
                            </TableCell>
                            <TableCell align="right" >{
                                <Typography noWrap={true} style={{width: 100}}>
                                    {
                                        args[key] !== null ? JSON.stringify(args[key]) : "null"
                                    }
                                </Typography>
                            }</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

ArgumentTable.propTypes = {
    arguments: PropTypes.object.isRequired,
}
