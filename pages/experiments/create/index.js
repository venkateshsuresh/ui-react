import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TitleAndDescription from "../../../components/TitleAndDescription";
import Paper from "@material-ui/core/Paper";
import MethodList from "../../../components/MethodList";
import SecretList from "../../../components/SecretList";
import {createDetails, getDetails} from "../../../utils/fetch-util";
import CircularProgress from "@material-ui/core/CircularProgress";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    actions: {
        textAlign: "right",
        marginBottom: 60,
        marginRight: 60
    },
    content: {
        width: '90%',
        margin: "auto"
    },
    stepper: {
        margin: "auto",
        width: "90%",
        textAlign: "center",
        marginBottom: 30
    },
    search: {
        marginRight: 25,
        marginBottom: 20,
        marginLeft: 25,
        marginTop: 30
    }
}));

function getSteps() {
    return ['Set title and description', 'Add Secrets', 'Create probes', 'Create chaos methods', 'Create rollbacks', 'Finish'];
}

function isStepOptional(step) {
    switch (step) {
        case 2:
        case 4:
            return true;
        default:
            return false;
    }
}



export default function CreateExperiment() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const steps = getSteps();

    const [disable, setDisable] = React.useState(true);
    const [disableBack, setDisableBack] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [experiment, setExperiment] = React.useState({
        version: "0.1.0",
        title: "",
        description: "",
        tags: [],
        method: [],
        rollbacks: [],
        secrets: {},
        configuration: {
            "aws_region": "us-west-2"
        }
    });

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleFinish = () => {
        setDisable(true);
        setDisableBack(true);
        console.log("final", experiment)
        createDetails("http://localhost:8110/api/experiment", "", experiment)
            .then(res => {
                console.log(res);
                Router.push("/");
            })
            .catch(err => {
                console.log("error", err);
            });
    }

    const handleNext = () => {

        if (activeStep === getSteps().length - 1) {
            handleFinish();
            return;
        }
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function getStepComponent(step) {
        switch (step) {
            case 0:
                return (
                    <TitleAndDescription description={experiment.description} title={experiment.title} onChange={(event) => {
                        let newExperiment = {...experiment};
                        newExperiment[event.target.name] = event.target.value;
                        setDisable(prevState => newExperiment.title === "" || newExperiment.description === "");
                        setExperiment(newExperiment);
                    }}/>
                );
            case 1:
                return (
                    <SecretList
                        secrets={experiment.secrets}
                        onChange={(secrets) => {
                            let newExperiment = {...experiment};
                            newExperiment.secrets = secrets;
                            setExperiment(newExperiment);
                        }}
                    />
                )
            case 2:
                return (
                    <div style={{margin: "auto", textAlign: "center"}}>
                        <img style={{marginTop: 60}} src="/construction_in_progress.png" alt={"work in progress"}/>
                        <Typography style={{marginBottom: 60}}>
                            Work in progress
                        </Typography>
                    </div>
                )
            case 3:
                return (
                    <MethodList
                        secrets={experiment.secrets}
                        method={experiment.method}
                        onChange={(method) => {
                            let newExperiment = {...experiment};
                            newExperiment.method = method;
                            setExperiment(newExperiment);
                        }}
                    />
                )
            case 4:
                return (
                    <MethodList
                        secrets={experiment.secrets}
                        method={experiment.rollbacks}
                        onChange={(method) => {
                            let newExperiment = {...experiment};
                            newExperiment.rollbacks = method;
                            console.log("rollbacks", newExperiment)
                            setExperiment(newExperiment);
                        }}
                    />
                )
            case 5:
                return (
                    <div style={{marginTop: 60, width: "100%", textAlign: "center"}} >
                        {
                            loading && <CircularProgress style={{margin: "auto"}}/>
                        }
                    </div>
                )
            default:
                return (<React.Fragment/>);
        }
    }

    return (
        <React.Fragment>
            <div className={classes.root}>
                <Paper variant={"outlined"} className={classes.stepper}>
                    <Stepper activeStep={activeStep} >
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = <Typography variant="caption">Optional</Typography>;
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Paper>
                <div>
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Paper variant="outlined" className={classes.content}>
                                {getStepComponent(activeStep)}
                                <div className={classes.actions}>
                                    <Button disabled={activeStep === 0 || disableBack} onClick={handleBack} className={classes.button}>
                                        Back
                                    </Button>
                                    {isStepOptional(activeStep) && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleSkip}
                                            className={classes.button}
                                        >
                                            Skip
                                        </Button>
                                    )}

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleNext}
                                        disabled={disable}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>
                            </Paper>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}
