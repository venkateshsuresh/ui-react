import React, {useState} from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    access_key: {
        marginRight: 25,
        marginBottom: 20,
        marginLeft: 25,
        marginTop: 30,
        width: 500
    }
}));

export default function AddSecret(props) {

    const classes = useStyles();

    const [name, setName] = useState("");
    const [secret, setSecret] = useState({
        aws_access_key_id: "",
        aws_secret_access_key: ""
    });

    function onChange(event) {
        let newSecret = {...secret};
        newSecret[event.target.name] = event.target.value;
        setSecret(newSecret);
    }

    return(
        <React.Fragment>
            <TextField
                className={classes.access_key}
                name={"name"}
                placeholder={"name"}
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <TextField
                className={classes.access_key}
                name={"aws_access_key_id"}
                placeholder={"aws_access_key_id"}
                value={secret.aws_access_key_id}
                onChange={onChange}
            />
            <TextField
                className={classes.access_key}
                name={"aws_secret_access_key"}
                placeholder={"aws_secret_access_key"}
                value={secret.aws_secret_access_key}
                onChange={onChange}
            />
            <Button variant={"outlined"} className={classes.access_key} onClick={() => {
                props.onAddSecret(name, secret);
            }}>
                Add
            </Button>
        </React.Fragment>
    )
}

AddSecret.propTypes = {
    onAddSecret: PropTypes.func.isRequired,
}