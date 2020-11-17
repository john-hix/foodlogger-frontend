import React, {useEffect} from 'react';
import axios, { AxiosRequestConfig } from 'axios'
import { useAuth0, OAuthError } from '@auth0/auth0-react'

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button' 
import Snackbar from '@material-ui/core/Snackbar'
import Page from '../../components/Page'
import TopBarAwareProps from '../../components/AppBar/topbar-aware-props'
import MobileStepper from '@material-ui/core/MobileStepper';
import Alert from '@material-ui/lab/Alert'; // NOTE: lab component
import { makeStyles, useTheme } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import {
    Link,
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useLocation,
} from "react-router-dom";


import Loader from '../../components/Loader'
import Step1 from './Step1-welcome'
import Step2 from './Step2-goals'
import Step3 from './Step3-diet'
import config from '../../config';
import PrivateRoute from '../../components/PrivateRoute';

const numSteps = 3;

const useStyles = makeStyles({
    stepper: {
      maxWidth: '100%',
      flexGrow: 1,
    },
    stepPaper: {
        display: 'block',
        margin: '2% 2% 15%',
        padding: '2%',
    },
    errorBox: {
        marginBottom: '10%' // to space over mobile stepper
    }
});

function usePathForActiveStep(isAuthenticated: boolean) {
    const step = useLocation().pathname.split('/')?.pop();
    if (step) {
        const parsed = parseInt(step);
        if (! Number.isNaN(parsed) && (0 < parsed && parsed <= numSteps) ) {
            return parsed;
        }
    }
    return 1;
}


function showLoadingOnInit(activeStep:number): boolean {
    if (activeStep === 1) { return false; }
    return true;
}

function appBarTitleFromStep(activeStep: number): string {
    let appBarTitle = "Welcome";
    switch(activeStep) {
        case 2:
            appBarTitle = 'Make it yours';
            break;
        case 3:
            appBarTitle = 'Set a goal';
            break;
    }
    return appBarTitle;
}

export interface LandingPageProps  {
    appBar: TopBarAwareProps
}

function LandingPage(props: LandingPageProps) {

    const classes = useStyles();
    const theme = useTheme();

    // Handle authentication/account creation
    const {
        loginWithRedirect,
        user,
        getAccessTokenSilently,
        isAuthenticated
    } = useAuth0();

    // App bar state
    const {changeAppBar} = props.appBar;
    const {pageTitle}    = props.appBar.state

    // We change our onboarding step in response to some errors, e.g. being
    // on step 2 without authorizing with auth0
    const [error, setError] = React.useState< null | Error>(null);
    const hasError = error !== null;

    // Onboarding steps state
    const activeStep = usePathForActiveStep(isAuthenticated);
    const [isLoading, setLoading] = React.useState( showLoadingOnInit(activeStep) );

    const [dietGoalId, setDietGoal] = React.useState(-1); // The diet goal id they have selected

    // Routing for subroutes (steps in onboarding process)
    const { path, url } = useRouteMatch();
    
    // Update app bar when needed, as user progresses through onboarding
    useEffect(() => {
        const appopriateTitle = appBarTitleFromStep(activeStep);
        if (pageTitle !== appopriateTitle) { // probably redundant
            changeAppBar({pageTitle: appopriateTitle});
        }
    }, [activeStep, pageTitle, changeAppBar]);


    // Handle redirect from auth0 to step 2
    // create a user in our backend if it doesn't exist already
    // block UI w/ loader to avoid races, notify when user already exists.
    useEffect(() => {
        // make sure user is logged in and we are at `welcome/2` before proceeding
        if (!user || (window.location.pathname !== '/welcome/2')) {
            return;
        }
        setLoading(true);
        const usrEndpt = `${config.BACKEND_URL}/users`;
        const reqConfig: AxiosRequestConfig = { headers: {} };
        getAccessTokenSilently()
        .then((tokenStr) => {
            reqConfig.headers.Authorization = `Bearer ${tokenStr}`;
            // ck if user exists
            return axios.get(`${usrEndpt}/${user.id}`, reqConfig);
        })
        .then((res) => {
            // Only proceed to create user if it doesn't exist yet
            if (res.status === 404) {
                return axios.post(usrEndpt, {
                    auth0Id: user.id
                }, reqConfig);
            }
                // User already exists, just get the record (should be cached)
                return axios.get(`${usrEndpt}/${user.id}`, reqConfig);
        })
        .then((res) => {
            setLoading(false);
        })
        .catch((e: Error | OAuthError) => {
            return setError(e); // We'll show the user something!
            
            // @TODO: report here or make it bubble up to catch-all report?
            // research frontend logging implementation
        })
    
    }, [user, getAccessTokenSilently])

    // User clicked next. Action depends on step in onboarding process
    // 1) go to auth0 to create account
    // 2) save info about user and why they want to use the app
    // 3) save their chosen diet goal
    const handleNext = () => {
        setLoading(true);
        
        // For step 1
        if (activeStep === 1) {
            loginWithRedirect({
                screen_hint: 'signup',
                redirectUri: config.FRONTEND_URL + '/welcome/2'
            });
        }
        // For Step 2
        // save goals info
        if (activeStep === 2) {
            
        }

        // For Step 3
        // save diet/physical info
        if (activeStep === 3) {
            
        }

    };

    // User clicked back.
    const handleBack = () => {
        if (activeStep === 1) { throw new Error("Should not allow user to go back from step 1."); }
        
        // Cleanup/reset logic as needed

    };

    const handleErrorClose = () => {
        setError(null);
    }

    const saveSelectedGoal = (selectedGoal: number) => {
        setDietGoal(selectedGoal);
    }


    return (
        <Page title={`${(activeStep === 0) ? "Nutrition and calorie counter app" : `Sign-up step ${activeStep}`} | FoodLogger`}>    
            <Paper elevation={0} className={classes.stepPaper} children={
            // Added complexity because this route has both
            // authenticated and unauthenticated views.
            (!isAuthenticated && path !== '/welcome') ?   
            <Redirect
            to={{
              pathname: '/welcome'
            }}
           />
           :
            (isLoading) ? <Loader /> :
            <Switch>
                <Route exact path={path}>
                    <Step1 />
                </Route>
                <Route path={`${path}/1`}>
                    <Redirect to={path} />
                </Route>
                <PrivateRoute path={`${path}/2`}>
                    <Step2  />
                </PrivateRoute>
                <PrivateRoute path={`${path}/3`}>
                    <Step3 saveSelectedGoal={saveSelectedGoal} />
                </PrivateRoute>
            </Switch>
            } />

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
            {(hasError) ? 
            <Snackbar className={classes.errorBox} open={hasError} autoHideDuration={6000} onClose={handleErrorClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleErrorClose} severity="error">
                    {(error !== null) ? error.message : null}
                </Alert>
            </Snackbar>
            : null
        }
        </Page>
    )
  
}
export default LandingPage; 
