import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useAuth0 } from '@auth0/auth0-react'
import ExitToApp from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Avatar from '@material-ui/core/Avatar'

import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    drawerInner: {
      width: 250
    },
    bottomList: {
      position: 'absolute',
      bottom: 0,
      width: '100%'
    }
  })
);

export default function() {
    const classes = useStyles();
    const [isOpen, setOpen] = useState(false);
    const {
      isAuthenticated,
      logout,
      loginWithRedirect
    } = useAuth0();

    const closeDrawer = () => {
      setOpen(false);
    }

    const toggleDrawer = () => {
      setOpen(!isOpen);
    }

    const toggleLogin = () => {
      if (isAuthenticated) {
        logout();
      } else {
        loginWithRedirect({
          returnTo: '/'
        });
      }
    }

    return (
      <React.Fragment>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
          onClick={toggleDrawer} >
            <MenuIcon />
        </IconButton>
        <Drawer anchor='left' open={isOpen} onClose={closeDrawer}>
          <div className={classes.drawerInner}>
            <List className={classes.bottomList}>
              <ListItem button onClick={toggleLogin}>
                <ListItemIcon><ExitToApp /></ListItemIcon>
                <ListItemText primary={(isAuthenticated) ? 'Log out' : 'Log in'} />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </React.Fragment>
    )

}
