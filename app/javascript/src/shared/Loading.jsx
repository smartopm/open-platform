import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import CenteredContent from './CenteredContent';
/**
 *
 * @deprecated use Spinner instead because it does not break the whole page
 */
export default function Loading() {
  return (
    <div className={css(styles.todoSection)} data-testid="loader">
      <div className="d-flex w-100 justify-content-center align-self-center">
        <div className="lds-ripple">
          <div />
          <div />
        </div>
      </div>
    </div>
  );
}



export function Spinner() {
  return (
    <CenteredContent>
      <CircularProgress size={30} thickness={5} data-testid="loader" color='primary' />
    </CenteredContent>
  );
}

export function LinearSpinner() {
  return (
    <LinearProgress color="inherit" data-testid="linear-loader" variant="indeterminate" />
  );
}

const styles = StyleSheet.create({
  todoSection: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
});
