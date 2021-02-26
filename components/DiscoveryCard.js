import ButtonBase from "@material-ui/core/ButtonBase";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {red} from "@material-ui/core/colors";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    cardRoot: {
        width: 500,
        height: 300
    },
    buttonRoot: {
        maxWidth: 500,
        minHeight: 300,
        marginTop: 30,
        marginRight: 30,
        marginLeft: 30
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
    margin: {
        margin: theme.spacing(1),
    },
    cardSelected: {
        width: 500,
        height: 300,
        border: "2px solid black"
    }
}));

export function DiscoveryCard(props) {
    const classes = useStyles();

    return (
        <ButtonBase focusRipple className={classes.buttonRoot} onClick={() => props.addToSelected(props.activity)}>
            <Card className={classes.cardRoot} variant={"outlined"} >
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" style={{
                            backgroundColor: red[500]
                        }}>
                            {props.activity.name.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={props.activity.name.toUpperCase()}
                    subheader={props.activity.mod}
                    style={{textAlign: "left"}}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" align={"left"}>
                        {props.activity.doc}
                    </Typography>
                </CardContent>
            </Card>
        </ButtonBase>
    )
}

DiscoveryCard.propTypes = {
    activity: PropTypes.object.isRequired,
    addToSelected: PropTypes.func.isRequired,
}