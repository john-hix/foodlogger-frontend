import React, {useEffect} from 'react';
import {Button, Paper} from '@material-ui/core';
import MobileStepper from '@material-ui/core/MobileStepper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import {
    BrowserRouter as Router,
    Link,
    useRouteMatch,
    useHistory,
    useLocation
  } from "react-router-dom";

const useStyles = makeStyles({
    stepper: {
      maxWidth: '100%',
      flexGrow: 1,
    }
});

function StepperOnboarding(props: {
    numSteps: number,
    activeStep: number,
    handleNext: () => void,
    handleBack: () => void,
    disableLinkFirstStep: boolean

}) {
    const classes = useStyles();
    const theme = useTheme();
    const { path, url } = useRouteMatch();
    const {activeStep, numSteps, disableLinkFirstStep,
        handleNext, handleBack} = props;

    return (
        <MobileStepper
            variant="dots"
            steps={numSteps}
            position="bottom"
            activeStep={activeStep-1}
            className={classes.stepper}
            nextButton={(activeStep === numSteps || activeStep === 1) ?
                (
                    <Button size="small" onClick={handleNext}
                    color={(activeStep === numSteps) ? 'primary' : 'default'}
                    variant={(activeStep === numSteps) ? 'contained' : 'text'}>
                    {(activeStep !== numSteps) ? 'Next' : 'Finish'}
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                )
                :
                (
                    <Link to={`${url}/${activeStep+1}`}>
                    <Button size="small" onClick={handleNext}>
                    'Next'
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                    </Link>
                )
            }
            backButton={
                <Link to={`${url}/${activeStep-1}`}>
                    <Button size="small" onClick={handleBack} disabled={activeStep === 1}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    Back
                    </Button>
                </Link>
            }
            />
    )
}

export default StepperOnboarding;
