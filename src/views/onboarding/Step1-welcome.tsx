import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {useAuth0} from '@auth0/auth0-react'
import Image from 'material-ui-image'
import {Box, Grid, Button} from '@material-ui/core'
import Stepper from '../../components/StepperOnboarding'
import config from '../../config';

const useStyles = makeStyles({
    loginBtn: {
      marginTop: '10%'
    },
    gridContainer: {
        alignItems: 'top'
    }
  });

export default function Step1Welcome() {
    const classes = useStyles();
    const {
        loginWithRedirect
        } = useAuth0();

    return (
        <Grid container className={classes.gridContainer} spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                <Image src="https://via.placeholder.com/300x400.webp/?text=This%20app%20rocks" alt="This app rocks"/>
            </Grid>
            <Grid item xl={8} lg={8} md={6} sm={6} xs={12}>
                <Box display={{ xs: 'none', sm: 'block', md: 'block', lg: 'block', xl: 'block' }}>
                    <h2>Take control of your diet</h2>
                </Box>
                <Button variant="contained" color="primary" className={classes.loginBtn} onClick={() => loginWithRedirect({
                    screen_hint: 'signup',
                    redirectUri: config.FRONTEND_URL + '/welcome/2'
                })}>Sign up!</Button>
            </Grid>
        </Grid>
    )

}
