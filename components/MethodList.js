import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import DiscoveryList from "./DiscoveryList";
import Drawer from "@material-ui/core/Drawer";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {red} from "@material-ui/core/colors";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import {getDetails} from "../utils/fetch-util";
import ArgumentTable from "./ArgumentTable";
import EditArguments from "./EditArguments";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        margin: 30,
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        margin: "auto",
        width: 3000,
    },
    gridListHeader: {
        flexGrow: 1,
        paddingRight: 30
    },
    cardRoot: {
        maxWidth: 360,
        margin: 10,
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
}));

export default function MethodList(props) {

    const classes = useStyles();

    const [openDrawer, setOpenDrawer] = useState(false);

    const [discovery, setDiscovery] = useState({});

    const [method, setMethod] = useState([]);

    const [disableNext, setDisableNext] = useState(true);

    const [openEditDrawer, setOpenEditDrawer] = useState(false);

    const [selectedMethodIndexForEdit, setSelectedMethodIndexForEdit] = useState(-1);

    const [selectedDiscoveryList, setSelectedDiscoveryList] = useState([]);

    function onAddMethod(selectedDiscovery) {
        let methods = selectedDiscovery.map(d => convertDiscoveryIntoMethod(d));
        //setSelectedDiscoveryList([...selectedDiscoveryList, ...selectedDiscovery]);
        props.onChange([...method, ...methods])
        //setMethod([...method, ...methods]);
        setOpenDrawer(false);
        console.log("onAddMethod", [...method, ...methods])
    }

    useEffect(() => {
        let newSelectedDiscoveryList = discovery.activities ? discovery.activities.filter(d => {
            return method.map(m => m.provider.func).includes(d.name) && method.map(m => m.provider.module).includes(d.mod);
        }) : [];
        setSelectedDiscoveryList(newSelectedDiscoveryList);
    }, [method, discovery]);

    useEffect(() => {
        setMethod(props.method);
        console.log("useeffect", props.method)
    }, [props.method]);

    function convertDiscoveryIntoMethod(discovery) {
        // example method
        // {
        //     "type": "action",
        //     "name": "stop_instance",
        //     "provider": {
        //         "type": "python",
        //         "module": "chaosaws.ec2.actions",
        //         "func": "stop_instance",
        //         "arguments": {
        //             "instance_id": "i-079ac6f9a77ae616f",
        //             "az": null,
        //             "force": true,
        //             "filters": null
        //         }
        //     },
        //     "pauses": {
        //         "after": 60
        //     }
        // }

        // example discovery
        // {
        //     "type": "action",
        //     "name": "untag_resource",
        //     "mod": "chaosaws.ecs.actions",
        //     "doc": "Removes the given tags from the provided resource\n\n** For ECS resources, the long form ARN must be used\nhttps://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-arn-timeline\n\nExample:\n    {\n        \"tag_keys\": [\"MyTagKey\", \"MyOtherTagKey\"],\n        \"resource_arn\": \"arn:aws:ecs:...:service/cluster-name/service-name\"\n    }\n\n:param tag_keys: A list of tag keys to remove\n:param resource_arn: The ARN of the resource to tag.\n    Valid resources: capacity providers, tasks, services, task definitions,\n    clusters, and container instances\n:param configuration: access values used by actions/probes\n:param secrets: values that need to be passed on to actions/probes\n:return: Dict[str, Any]",
        //     "arguments": [
        //         {
        //             "name": "tag_keys",
        //             "type": "list"
        //         },
        //         {
        //             "name": "resource_arn",
        //             "type": "string"
        //         },
        //         {
        //             "name": "configuration",
        //             "default": null,
        //             "type": "mapping"
        //         },
        //         {
        //             "name": "secrets",
        //             "default": null,
        //             "type": "mapping"
        //         }
        //     ]
        // }

        let method = {};
        method["type"] = discovery["type"];
        method["name"] = discovery["name"];
        let provider = {};
        // default all values will be python
        provider["type"] = "python";
        provider["module"] = discovery["mod"];
        provider["func"] = discovery["name"];
        let argumentsList = {};
        discovery.arguments.forEach(arg => {
            switch (arg.type) {
                case "list":
                    argumentsList[arg.name] = "default" in arg ? arg.default : [];
                    break;
                case "string":
                    argumentsList[arg.name] = "default" in arg ? arg.default : "";
                    break;
                case "mapping":
                    argumentsList[arg.name] = "default" in arg ? arg.default : {};
                    break;
                case "boolean":
                    argumentsList[arg.name] = "default" in arg ? arg.default : false;
                    break;
                case "integer":
                    argumentsList[arg.name] = "default" in arg ? arg.default : 0;
                    break;
                default:
                    argumentsList[arg.name] = null;
            }
        });
        provider["arguments"] = argumentsList;
        method["provider"] = provider;
        let pauses = {};
        pauses["after"] = 0;
        pauses["before"] = 0;
        method["pauses"] = pauses;

        return method;
    }

    useEffect(() => {
        getDetails("http://localhost:8110/api/discovery")
            .then(res => {
                res.activities = res.activities.filter(a => a.type === "action");
                setDiscovery(res);
            });
    }, []);

    function ExperimentCard(props) {
        return (
            <Card className={classes.cardRoot} variant={"outlined"}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" style={{
                            backgroundColor: red[500]
                        }}>
                            {
                                props.method.name.toUpperCase().charAt(0)
                            }
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="share">
                            <EditIcon onClick={() => props.setSelectedMethodIndexForEdit(props.index)}/>
                        </IconButton>
                    }
                    title={props.method.name}
                    subheader="September 14, 2016"
                />
                <CardContent>
                    <Typography variant={"h6"}>
                        Arguments
                    </Typography>
                    <ArgumentTable arguments={props.method.provider.arguments}/>
                </CardContent>
            </Card>
        )
    }

    return (
        <React.Fragment>
            <Drawer anchor={"right"} open={openDrawer} elevation={1} onClose={() => setOpenDrawer(false)}>
                <DiscoveryList discovery={discovery} onAddMethod={onAddMethod}/>
            </Drawer>
            <Drawer anchor={"right"} open={openEditDrawer} elevation={1} onClose={() => setOpenEditDrawer(false)}>
                <EditArguments
                    method={method[selectedMethodIndexForEdit]}
                    discovery={selectedDiscoveryList[selectedMethodIndexForEdit]}
                    secrets={props.secrets}
                    updateMethod={(meth) => {
                        let newMethod = [...method];
                        newMethod[selectedMethodIndexForEdit] = meth;
                        props.onChange(newMethod);
                        setOpenEditDrawer(false);
                        //setMethod(newMethod);
                    }}
                />
            </Drawer>
            <div className={classes.root}>
                <GridList cellHeight={'auto'} className={classes.gridList} spacing={50} cols={3}>
                    <GridListTile style={{ height: "auto" }} cols={3} >
                        <Grid container direction={"row"} className={classes.gridListHeader} justify={"flex-end"} spacing={1}>
                            <Grid item >
                                <TextField
                                    className={classes.margin}
                                    id="input-with-icon-textfield"
                                    placeholder={"Search"}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item >
                                <Button startIcon={<AddIcon/>} variant={"outlined"} color={"secondary"} onClick={() => setOpenDrawer(true)}>
                                    Add Method
                                </Button>
                            </Grid>
                        </Grid>
                    </GridListTile>
                    {
                        method.map((method, index) => {
                            return (
                                <GridListTile key={index}>
                                    <ExperimentCard method={method} index={index} setSelectedMethodIndexForEdit={(index) => {
                                        setSelectedMethodIndexForEdit(index);
                                        setOpenEditDrawer(true);
                                        console.log(selectedDiscoveryList[index])
                                    }}/>
                                </GridListTile>
                            )
                        })
                    }
                </GridList>
            </div>
        </React.Fragment>
    )
}

MethodList.propTypes = {
    secrets: PropTypes.object.isRequired,
    method: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
}