import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 50,
        flexDirection: "row",
        alignItems: "center"
    },

    row: {
        margin: 10
    }
}));

export default function TitleAndDescription(props) {
    const classes = useStyles();

    const [state, setState] = useState({
        title: "",
        description: ""
    });

    useEffect(() => {
        let newState = {...state};
        newState.title = props.title;
        newState.description = props.description;
        setState(newState);
    }, [props.description, props.title]);


    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={3} className={classes.row}>
                    <Grid item xs={6}>
                        <Typography variant={"h5"}>
                            Title
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            placeholder={"Title..."}
                            variant="outlined"
                            value={state.title}
                            onChange={event => props.onChange(event)}
                            name={"title"}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3} className={classes.row}>
                    <Grid item xs={6}>
                        <Typography variant={"h5"}>
                            Description
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            placeholder={"Description..."}
                            variant="outlined"
                            multiline
                            rows={10}
                            value={state.description}
                            name={"description"}
                            onChange={event => props.onChange(event)}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

TitleAndDescription.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}