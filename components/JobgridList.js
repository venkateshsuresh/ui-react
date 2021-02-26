import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/Edit';
import {red} from "@material-ui/core/colors";
import {getDetails} from "../utils/fetch-util";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 3000,
    },
    gridListHeader: {
        flexGrow: 1,
        paddingRight: 30,
        marginTop: 30
    },
    cardRoot: {
        maxWidth: 345,
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
}));

export default function ExperimentGridList() {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [experiments, setExperiments] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState("");

    useEffect(() => {
        getDetails("http://localhost:8110/api/experiment")
            .then(res => setExperiments(res))
            .catch(err => console.log(err));
    }, []);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    function ExperimentCard(props) {
        return (
            <Card className={classes.cardRoot} variant={"outlined"}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" style={{
                            backgroundColor: red[500]
                        }}>
                            {
                                props.title.toUpperCase().charAt(0)
                            }
                        </Avatar>
                    }
                    action={
                        function () {
                            if (loading) {
                                return (<CircularProgress size={30}/>);
                            }
                            switch (status) {
                                case "success":
                                    return (<CheckCircleIcon style={{color: "green"}} fontSize={"large"}/>);
                                case "failed":
                                    return (<CancelIcon style={{color: "red"}} fontSize={"large"}/>);
                            }
                        }()
                    }
                    title={props.title}
                    subheader="September 14, 2016"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                        aria-label="add to favorites"
                        onClick={() => {
                            setLoading(true);
                            getDetails("http://localhost:8110/api/experiment/run")
                                .then(res => {
                                    setLoading(false);
                                    let status = "success";
                                    res.run.forEach(a => {
                                        if (a.status !== "succeeded") {
                                            status = "failed";
                                        }
                                    });
                                    setStatus(status);
                                })
                                .catch(err => {
                                    console.log(err);
                                    setLoading(false);
                                    setStatus("failed");
                                })
                        }}
                    >
                        <PlayArrowIcon />
                    </IconButton>
                    <IconButton aria-label="share" onClick={() => {Router.push("/experiments/create")}}>
                        <EditIcon />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }

    return (
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
                            <Button startIcon={<AddIcon/>} variant={"outlined"} color={"secondary"} onClick={() => Router.push("/Job/createJob")}>
                                Create Job
                            </Button>
                        </Grid>
                    </Grid>
                </GridListTile>
                {
                    experiments.map(e => (
                        <GridListTile >
                            <ExperimentCard title={e.title} description={e.description}/>
                        </GridListTile>
                    ))
                }

            </GridList>
        </div>
    );
}