import React, { Component } from 'react';
import Page from '../components/Page';

class FailedLogin extends Component {
  render() {
    return (
      <Page title="Login error">
        <h1>Failed to log in</h1>
      </Page>
    )
  }
}
export default FailedLogin;
