import React, { Component, Fragment } from 'react';

class ClassicAsync extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, status: null, body: null };
  }

  componentDidMount() {
    let status = 0;

    fetch('http://localhost:3030/status', {headers: {
      authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InQtWVgzRVljdWU4SU0tOHFDd1RzQiJ9.eyJpc3MiOiJodHRwczovL2Rldi1rZ24xYXkxZC51cy5hdXRoMC5jb20vIiwic3ViIjoiQXphRnU1NlBVelZQdDU2N2JKMkJuSDBraFVTeVJJMGNAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcXVpY2tzdGFydHMvYXBpIiwiaWF0IjoxNTk5NTk1NDY3LCJleHAiOjE1OTk2ODE4NjcsImF6cCI6IkF6YUZ1NTZQVXpWUHQ1NjdiSjJCbkgwa2hVU3lSSTBjIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.CBgwFG4v2cxrP2MqqciQ1LsFArZATzu9tMZB5e8Xmk_OVpyNFkeHBucOyLayPEyYtkoy28i22HQDJc0cA8sGIbhqQBRHhB5dK5HMtIltXlmEFg9z47nS6WRY8e-EqEfnD6nn7VAk0zlxgpDd2hn1crY0OGQkSiukqB5i5bJCpB5E7l58vkfTNPbCV7erarGRbe_6oXIZ0ahHOk66kRn6NDAqSNtQj0r6xjT0d48RfeC7MC_sMfF83XNueGj73j4XWVGIOyDPjqBhSxDVGWHSwjeKRvfnu4f3v4fuxrV9bSfnR255hbmNBgc9ByLFsP-awsgGwiRh-NTovLXjyxXFGQ'
    }})
      .then((response) => {
        status = response.status;
        if (response.bodyUsed ) {
          return response.json();
        }
        return false;
      })
      .then((json) => {
        const newState = { loading: false, status }
        if (json) {
          newState.body = JSON.stringify(json);
        }
        this.setState(newState);
      });
        
      // .catch(e => this.setState({loading: false, res: {status: 12}}));
  }

  renderRes = (status, body) => {
    return (
      <div>
        <h3>Status: {status}</h3>
        <code>{body}</code>
      </div>
      
    );
  };

  render() {
    const { loading, status, body } = this.state;

    return (
      <Fragment>
        <h2 style={{ textAlign: 'center' }}>
          {`React: ${React.version} Demo`}
        </h2>
        {loading ? 'Classic loading placeholder' : this.renderRes(status, body)}
      </Fragment>
    );
  }
}

export default ClassicAsync;
