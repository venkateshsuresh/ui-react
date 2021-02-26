import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import Drawer from "@material-ui/core/Drawer";
import AddSecret from "./AddSecret";
import {makeStyles} from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import Router from "next/router";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {red} from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import EditIcon from "@material-ui/icons/Edit";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import PropTypes, {func} from "prop-types";
import {DiscoveryCard} from "./DiscoveryCard";
import Divider from "@material-ui/core/Divider";

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

export default function SecretList(props) {

    const classes = useStyles();

    const [openDrawer, setOpenDrawer] = useState(false);

    const [expanded, setExpanded] = React.useState(false);

    const [secrets, setSecrets] = React.useState({});

    useEffect(() => {
        setSecrets(props.secrets);
    }, [props.secrets]);

    function maskCredentials(credential, unmaskLength = 4) {
        return `${'*'.repeat(14)}${credential.substr(credential.length - unmaskLength)}`;
    }

    function ExperimentCard(props) {
        return (
            <Card className={classes.cardRoot} variant={"outlined"}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" style={{
                            backgroundColor: red[500]
                        }}>
                            {
                                props.name.toUpperCase().charAt(0)
                            }
                        </Avatar>
                    }
                    title={props.name}
                    subheader="September 14, 2016"
                />
                <CardContent>
                    <Typography variant="h5">
                        Aws Access Key Id
                    </Typography>
                    <Typography variant="body2" style={{margin: 10, textAlign: "left"}}>
                        {
                            maskCredentials(props.secret.aws_access_key_id)
                        }
                    </Typography>
                    <Divider light />
                    <Typography variant="h5" style={{marginTop: 10}}>
                        Aws Secret Access Key
                    </Typography>
                    <Typography variant="body2" style={{margin: 10, textAlign: "left"}}>
                        {
                            maskCredentials(props.secret.aws_secret_access_key)
                        }
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="share">
                        <EditIcon />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }

    function onAddSecret(name, secret) {
        let newSecrets = {...secrets};
        newSecrets[name] = secret;
        props.onChange(newSecrets);
        setOpenDrawer(false);
    }
    return (
        <React.Fragment>
            <Drawer anchor={"right"} open={openDrawer} elevation={1} onClose={() => setOpenDrawer(false)}>
                <AddSecret onAddSecret={onAddSecret}/>
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
                                    Create Secret
                                </Button>
                            </Grid>
                        </Grid>
                    </GridListTile>
                    {
                        Object.keys(secrets).map(key => {
                            return (
                                <GridListTile >
                                    <ExperimentCard name={key} secret={secrets[key]}/>
                                </GridListTile>
                            )
                        })
                    }
                </GridList>
            </div>
        </React.Fragment>
    )
}

SecretList.propTypes = {
    secrets: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}