import React, {useContext} from 'react';
import { StyleSheet, css } from 'aphrodite';

import {Context as AuthStateContext} from './Provider/AuthStateProvider.js';


export default (props) => {
  const authState = useContext(AuthStateContext)
  return (<Component props={props} authState={authState} />)
}

export function Component({props, authState}) {

  function communityName() {
    if (authState.member && authState.member.community) {
      if (authState.member.community.logoUrl) {
        return(<img src={authState.member.community.logoUrl} className={css(styles.logo)} />)
      }
      return(<div>{authState.member.community.name}</div>)
    }
    return  "Community"
  }

  return (
    <div>
      <nav className={`navbar navbar-dark ${css(styles.navBar)}`}>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
        </div>

        <ul className="nav navbar-nav navbar-center">
          <li>{communityName()}</li>
        </ul>
      </nav>
      {props.children}
    </div>
  );
}


const styles = StyleSheet.create({
    logo: {
        height: '25px'
    },
    navBar: {
        backgroundColor: '#46ce84'
    },
});
