// A wrapper for <Route> that redirects to the login

import { Redirect, Route } from "react-router-dom";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

// A wrapper for <Route> that redirects to the welcome
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }: any) {
    const {isAuthenticated} = useAuth0();
    return (
      <Route
        {...rest}
        render={({ location }) =>
          isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/welcome",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  export default PrivateRoute;
