import React, {useEffect} from 'react';
import Page from '../components/Page';
import TopBarAwareProps from '../components/AppBar/topbar-aware-props'

function LogDay(props: {
  appBar: TopBarAwareProps
}) {

    const today = new Date();
    const appBarTitle = `${today.toDateString()}`;

    useEffect(() => {
        props.appBar.changeAppBar({
          pageTitle: appBarTitle
        });
      }, []); // empty array prevents re-rendering: https://stackoverflow.com/a/53465182

    return (
        <Page title={appBarTitle}>
          <ul>
              <li>Some</li>
              <li>display</li>
              <li>of</li>
              <li>Meals</li>
          </ul>
        </Page>
    )
    
}

export default LogDay;