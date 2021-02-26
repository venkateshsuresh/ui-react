import React, {useEffect, useState} from "react";
import {getDetails} from "../utils/fetch-util";
import {makeStyles} from "@material-ui/core/styles";
import {DiscoveryCard} from "./DiscoveryCard";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    cardRoot: {
        width: 500,
        height: 345
    },
    buttonRoot: {
        maxWidth: 490,
        minHeight: 345,
        margin: 30,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    margin: {
        margin: theme.spacing(1),
    },
    selectedChipArray: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        width: 500,
        marginTop: 2,
        marginBottom: 0,
        marginRight: 25,
        marginLeft: 25,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    search: {
        marginRight: 25,
        marginBottom: 20,
        marginLeft: 25,
        marginTop: 30
    }
}));

export default function DiscoveryList(props) {

    const classes = useStyles();
    const [state, setState] = useState({});
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setState(props.discovery);
    }, [props.discovery]);

    function addToSelected(selectedAction) {
        setSelected([...selected, selectedAction]);
    }

    function handleDelete(index) {
        let newSelected = [...selected];
        newSelected.splice(index, 1);
        setSelected(newSelected);
    }

    return (
        <React.Fragment>
            <TextField
                className={classes.search}
                id="input-with-icon-textfield"
                placeholder={"Search"}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            {
                selected.length > 0 &&
                <Paper component={"ul"} className={classes.selectedChipArray} variant={"outlined"}>
                    {selected.map((data, index) => {

                        return (
                            <li key={index}>
                                <Chip
                                    label={data.name}
                                    className={classes.chip}
                                    onDelete={() => {handleDelete(index)}}
                                />
                            </li>
                        );
                    })}
                    <Button variant={"outlined"} onClick={() => {
                        props.onAddMethod(selected);
                    }}>
                        Add
                    </Button>
                </Paper>
            }
            {
                state.activities &&
                state.activities
                    .filter(a => {
                        if (search !== "") {
                            return a.name.includes(search.toLowerCase());
                        }
                        return true;
                    })
                    .map(activity => {
                        return <DiscoveryCard key={activity.name + activity.mod} activity={activity} addToSelected={addToSelected}/>;
                    })
            }
        </React.Fragment>
    );
}

DiscoveryList.propTypes = {
    discovery: PropTypes.object.isRequired,
    onAddMethod: PropTypes.func.isRequired,
}