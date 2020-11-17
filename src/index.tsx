import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import authConfig from './auth_config';

ReactDOM.render(
<Auth0Provider
  domain={authConfig.domain}
  clientId={authConfig.clientId}
  redirectUri={window.location.origin}
>
  <React.StrictMode>
    <App />
  </React.StrictMode>
</Auth0Provider>,
document.getElementById("root")
);

