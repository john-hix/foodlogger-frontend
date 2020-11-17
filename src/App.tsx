import React, {useState} from 'react';
import './App.css';
import { useAuth0 } from "@auth0/auth0-react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import FailedLogin from './views/FailedLogin';
import Appbar, {defaultTopBarState, TopBarPropsUpdate} from './components/AppBar/Appbar';
import {Container} from '@material-ui/core';
import Landing from './views/onboarding/Onboarding';
import LogDay from './views/LogDay';
import TopBarAwareProps from './components/AppBar/topbar-aware-props';
import Loader from './components/Loader'
import PrivateRoute from './components/PrivateRoute';


export type handleAppBarChange = (pageTitle: string, backBtn: boolean) => void;

function App(props: any) {

  const { isAuthenticated, isLoading } = useAuth0();
  const [appBarState, setTopBarState] = useState(defaultTopBarState);

  const handleAppBarChange = (requestedState: TopBarPropsUpdate) => {
    const newState = {...appBarState, ...requestedState}; 
    setTopBarState(newState);
  }

  // The view components need to know what the app bar state is and how to
  // change it. Should move to a hook to avoid re-renders (confirm details,
  // but that hook is probably useReducer ala Redux)
  const appBarProp: TopBarAwareProps = {
    changeAppBar: handleAppBarChange,
    state: appBarState
  }

  return (
    <div className="App">
      <Router>
      <Appbar {...appBarState}/>
      {/* See what the loader will get replaced with for PWA flow */}
      {
        (isLoading) ? <Loader /> :
        <Container>
          <Switch>
            <Route exact path="/">
              <Redirect to={(isAuthenticated) ? '/logs/today' : '/welcome'} />
            </Route>
            <Route path="/welcome" >
                <Landing appBar={appBarProp} />
            </Route>
            <PrivateRoute path="/logs">
              <LogDay appBar={appBarProp}/>
            </PrivateRoute>
            <Route path="/login-failed">
              <FailedLogin />
            </Route>
          </Switch>
        </Container>
      }
      </Router>
    </div>
  );
}

export default App;
