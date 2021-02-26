import PropTypes, {number} from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {createDetails, getDetails} from "../utils/fetch-util";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 500,
        margin: 30
    },
    argument: {
        marginTop: 30,
        marginBottom: 30
    },
    fields: {
        width: "100%",
        margin: 0
    },
    button: {
        float: "right",
        marginTop: 30,
    }
}));

export default function EditArguments(props) {

    const classes = useStyles();

    const [method, setMethod] = useState({});
    const [options, setOptions] = useState([]);

    useEffect(() => {
        let newOptions = {};
        Object.keys(props.method.provider.arguments).forEach((arg) => {
            newOptions = {...newOptions, [arg]: []};
        });
        setOptions(newOptions);
        console.log("method", props.method)
        setMethod(props.method);
    }, [props.method]);

    function loadDetailsFromApi(api, secrets, argKey) {

        // todo: quickfix hardcoding region, fix it to load from configurations
        secrets.region = "us-west-2";
        createDetails(`http://localhost:8110/${api}`, "", secrets)
            .then(res => {
                console.log("res", res)
                let newOptions = {...options};
                newOptions[argKey] = res;
                setOptions(newOptions);
            });
    }

    return (
        <div className={classes.root}>
            <Typography variant={"h6"}>
                SECRET
            </Typography>
            <Autocomplete
                limitTags={3}
                value={method.provider && method.provider.secrets ? method.provider.secrets[0] : ""}
                onChange={(e, value) => {
                    let newMethod = {...method};
                    newMethod.provider.secrets = [value];
                    setMethod(newMethod);
                }}
                renderInput={params => (
                    <TextField {...params} variant="outlined"/>
                )}
                options={Object.keys(props.secrets)}
            />
            {
                method.provider && Object.keys(method.provider.arguments).map((arg, index) => {
                    return (
                        <div className={classes.argument}>
                            <Typography variant={"h6"}>
                                {`${arg.toUpperCase()}${"default" in props.discovery.arguments[index] ? "" : "*"}`}
                            </Typography>
                            {
                                function () {
                                    switch (props.discovery.arguments[index].type) {
                                        case "string":
                                            return (
                                                <Autocomplete
                                                    freeSolo={!props.discovery.arguments[index].api}
                                                    onOpen={() => {
                                                        props.discovery.arguments[index].api && loadDetailsFromApi(props.discovery.arguments[index].api, props.secrets[method.provider.secrets[0]], arg)
                                                    }}
                                                    onClose={() => {
                                                        setOptions({...options, [arg]: []})
                                                    }}
                                                    loading={props.discovery.arguments[index].api ? options[arg].length === 0 : false}
                                                    value={method.provider.arguments[arg] ? method.provider.arguments[arg] : ""}
                                                    onChange={(e, value) => {
                                                        let newMethod = {...method};
                                                        newMethod.provider.arguments[arg] = value;
                                                        setMethod(newMethod);
                                                    }}
                                                    renderInput={params => (
                                                        <TextField {...params} variant="outlined"/>
                                                    )}
                                                    options={options[arg]}
                                                />
                                            )
                                        case "list":
                                            return (
                                                <Autocomplete
                                                    multiple
                                                    limitTags={3}
                                                    freeSolo={!props.discovery.arguments[index].api}
                                                    onOpen={() => {
                                                        props.discovery.arguments[index].api && loadDetailsFromApi(props.discovery.arguments[index].api, props.secrets[method.provider.secrets[0]], arg)
                                                    }}
                                                    onClose={() => {
                                                        setOptions({...options, [arg]: []})
                                                    }}
                                                    loading={props.discovery.arguments[index].api ? options[arg].length === 0 : false}
                                                    value={method.provider.arguments[arg] ? method.provider.arguments[arg] : []}
                                                    onChange={(e, value) => {
                                                        let newMethod = {...method};
                                                        newMethod.provider.arguments[arg] = value;
                                                        setMethod(newMethod);
                                                    }}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            // InputProps={{
                                                            //     ...params.InputProps,
                                                            //     endAdornment: (
                                                            //         <React.Fragment>
                                                            //             {(props.discovery.arguments[index].api ? options[arg].length === 0 : false) ? <CircularProgress color="inherit" size={20} /> : null}
                                                            //             {params.InputProps.endAdornment}
                                                            //         </React.Fragment>
                                                            //     ),
                                                            // }}
                                                        />
                                                    )}
                                                    options={options[arg]}
                                                />
                                            )
                                    }
                                }()
                            }
                        </div>
                    )
                })
            }
            <Typography variant={"h6"}>
                PAUSE BEFORE
            </Typography>
            <Autocomplete
                freeSolo
                limitTags={3}
                value={method.pause ? method.pauses.before : 0}
                onChange={(e, value) => {
                    let newMethod = {...method};
                    newMethod.pauses.before = !isNaN(value) ? parseInt(value) : 0;
                    setMethod(newMethod);
                }}
                renderInput={params => (
                    <TextField {...params} variant="outlined"/>
                )}
                options={["5", "10", "15", "30", "45", "60"]}
            />
            <div className={classes.argument}>
                <Typography variant={"h6"}>
                    PAUSE AFTER
                </Typography>
                <Autocomplete
                    freeSolo
                    limitTags={3}
                    value={method.pause ? method.pauses.after : 0}
                    onChange={(e, value) => {
                        let newMethod = {...method};
                        newMethod.pauses.after = !isNaN(value) ? parseInt(value) : 0;
                        setMethod(newMethod);
                    }}
                    renderInput={params => (
                        <TextField {...params} variant="outlined"/>
                    )}
                    options={["5", "10", "15", "30", "45", "60"]}
                />
            </div>
            <Button variant={"outlined"} className={classes.button} onClick={() => {
               props.updateMethod(method);
            }}>
                Add
            </Button>
        </div>
    )
}

EditArguments.propTypes = {
    secrets: PropTypes.object.isRequired,
    method: PropTypes.object.isRequired,
    discovery: PropTypes.object.isRequired,
    updateMethod: PropTypes.func.isRequired
}