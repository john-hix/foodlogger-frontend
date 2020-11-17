// Implemented as a class because React doesn't support error
// boundaries in hooks yet. 
// See https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes

import React, {Component} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

export interface ErrorUiDirectiveOptions {
    // Whether the error boundary component should attempt to rerender the offending
    // component tree or redirect to an error page.
    // default: false
    attemptRerender?: Boolean;
    showUsrMsg?: Boolean; // default: true; whether to show a toast for this error
    logErr?: Boolean; // default: true; whether to log this error to a server
}

export interface ErrorUiProps {
    attemptRerender: Boolean;
    showUsrMsg: Boolean; 
    usrMsg: string;  // default: 'An error occurred. It should be reported already.'
    logErr: Boolean;
}

export class ErrorUiDirective extends Error {
    constructor(message: string = 'An error occurred. You can view it in the console.',
        uiOptions: ErrorUiDirectiveOptions = {}) {
        
        super(message);
        const {attemptRerender, showUsrMsg, logErr} = uiOptions;

        this.attemptRerender = (typeof attemptRerender !== 'undefined') ? attemptRerender : false;
        this.showUsrMsg = (typeof showUsrMsg !== 'undefined') ? showUsrMsg : true;
        this.logErr = (typeof logErr !== 'undefined') ? logErr : true;

    }
    attemptRerender: Boolean;
    showUsrMsg: Boolean;
    logErr: Boolean;

    getUiProps(): ErrorUiProps {
        return {
            attemptRerender : this.attemptRerender,
            showUsrMsg      : this.showUsrMsg,
            usrMsg          : this.message,
            logErr          : this.logErr
        }
    }
}

// Interface only needed in this module for rendering component
interface ErrorBoundaryState extends ErrorUiProps {
    hasError: boolean;
    open: boolean;
}

export default class ErrorBoundary
extends Component <ErrorUiProps, ErrorBoundaryState> {
    
    constructor(props: ErrorUiProps) {
      super(props);
      this.state = {
        ...(new ErrorUiDirective().getUiProps()),
        hasError: false, open: false
      };
    }

    handleErrorClear() {

        this.setState({
            hasError: false, ...(new ErrorUiDirective().getUiProps())
        });
    }
  
    componentDidCatch(error: Error, info: any): void {
        
        const nextState = {
            hasError: true
        };

        // Use the UI information provided in the error if possible,
        // otherwise, use defaults.
        if (error instanceof ErrorUiDirective) {
            this.setState({ ...nextState, ...( error.getUiProps() ) });
        } else {
            this.setState({ ...nextState, ...(new ErrorUiDirective().getUiProps()) });
        }
        // @TODO: report to an error reporting service
        console.log(error);
    }
        render() {
            const { open, hasError, showUsrMsg, usrMsg, attemptRerender } = this.state;
            const { children } = this.props;
            if (!hasError) {
                return children;
            }

            return (
                <React.Fragment>
                    {(attemptRerender) ? children : <code>Fatal error. {(showUsrMsg) ? usrMsg : null}</code>}
                    {showUsrMsg ? 
                    <Snackbar open={open} autoHideDuration={6000} onClose={this.handleErrorClear.bind(this)}>
                        <MuiAlert onClose={this.handleErrorClear.bind(this)} severity="error">
                        {usrMsg}
                        </MuiAlert>
                    </Snackbar>
                    : null
                    }   
                </React.Fragment>
            )
            

        }
  }
