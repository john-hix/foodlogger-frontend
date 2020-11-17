import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {AppBar as UiAppBar, Toolbar, Button, Typography} from '@material-ui/core';
import DrawerBtn from './DrawerBtn';
import { useAuth0 } from '@auth0/auth0-react';
import AppBarLogin from './AppBarLogin'

export interface TopBarProps {
  backBtn: boolean;
  pageTitle: string;
  forceHideLoginBtn: boolean;
}

export interface TopBarPropsUpdate {
  backBtn?: boolean;
  pageTitle?: string;
  forceHideLoginBtn?: boolean;
}

export const defaultTopBarState: TopBarProps = {
  backBtn: false,
  pageTitle: '',
  forceHideLoginBtn: false
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }),
);

function AppBar(props: TopBarProps) {
    const classes = useStyles();

    const {isAuthenticated} = useAuth0();
    return (
    <UiAppBar elevation={3} position="static">
        <Toolbar>
            <DrawerBtn />
            <Typography variant="h6" className={classes.title}>
            {props.pageTitle}
            </Typography>
            <AppBarLogin forceHide={props.forceHideLoginBtn} />
        </Toolbar>
    </UiAppBar>
    )
}

export default AppBar; // Don’t forget to use export default!
