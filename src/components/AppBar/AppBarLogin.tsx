import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import config from '../../config';



function AppBarLogin(props: {
    forceHide: boolean
}) {

    const {isAuthenticated, loginWithRedirect} = useAuth0();
    if (!isAuthenticated && !props.forceHide) {
        return (
            <Button color="inherit" onClick={() => loginWithRedirect()}>Login</Button>
        )
    } else {
        return null;
    }
}

export default AppBarLogin; // Don’t forget to use export default!
