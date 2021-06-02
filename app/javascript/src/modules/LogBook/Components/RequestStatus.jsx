/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React, { useContext } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { Link } from 'react-router-dom';
import { useTheme } from '@material-ui/styles';
import { Context } from '../../../containers/Provider/AuthStateProvider';

/**
 * 
 * @param {any} props 
 * @returns ReactNode
 * @deprecated
 */
export default function RequestStatus(props) {
  const theme = useTheme()
  const authState = useContext(Context)
  return (
    <div
      className={`row justify-content-center align-items-center ${css(styles.waitPage)}`}
      style={{
        backgroundColor: props.isDenied ? theme.palette.secondary.main : theme.palette.primary.main
      }}
    >
      <h1 className={css(styles.title)} data-testid="status">{props.isDenied ? 'Denied' : 'Approved'}</h1>
      <br />
      <div className="col-10 col-sm-10 col-md-6">
        <Link
          to="/guard_home"
          className={`btn btn-lg btn-block ${css(styles.okButton)}`}
          style={{
            backgroundColor: props.isDenied ? theme.palette.secondary.main : theme.palette.primary.main
          }}
        >
          Ok
        </Link>
      </div>
      {props.isDenied ? (
        <div className="col-10 col-sm-10 col-md-6">
          <a
            href={`tel:${authState.user.community.securityManager}`}
            className={`btn btn-lg btn-block ${css(styles.callButton)}`}
            data-testid="action"
          >
            Call Manager
          </a>
        </div>
      ) : null}
    </div>
  );
}
const styles = StyleSheet.create({
  callButton: {
    backgroundColor: '#ed5757',
    textTransform: 'unset',
    color: '#FFFFFF',
    border: '2px solid black',
    borderColor: '#FFFFFF'
  },
  okButton: {
    textTransform: 'unset',
    color: '#FFFFFF',
    border: '2px solid black',
    borderColor: '#FFFFFF'
  },
  waitPage: {
    height: '100vh'
  },
  title: {
    color: '#FFFFFF'
  }
});
