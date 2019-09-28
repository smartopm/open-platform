import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import {Context as AuthStateContext} from './Provider/AuthStateProvider.js';


export default ({children, match}) => {
  console.log(match)
  const authState = useContext(AuthStateContext)
  const path = window.location.pathname;
  return (<Component {...{children, authState, path}}/>)
}

export function Component({children, authState, path}) {
  console.log(path)

  function backButtonOrMenu() {
    if (path !== '/') {
      return (<Link to='/' className="navbar-brand" href="/"><span className="oi oi-arrow-left"></span></Link>)
    }
    // TODO: @mdp future menu button
    return (
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    )
  }

  function communityName() {
    if (authState.member && authState.member.community) {
      if (authState.member.community.logoUrl) {
        return(<Link to='/'><img src={authState.member.community.logoUrl} className={css(styles.logo)} /></Link>)
      }
      return(<Link to='/'><div>{authState.member.community.name}</div></Link>)
    }
    return  "Community"
  }

  return (
    <nav className={`navbar navbar-dark ${css(styles.navBar)}`}>
      {backButtonOrMenu()}
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
