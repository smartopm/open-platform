import React, {useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';

import {Context as AuthStateContext} from './Provider/AuthStateProvider.js';


export default withRouter(function Nav({children, menuButton, history}) {
  const authState = useContext(AuthStateContext)
  return(<Component {...{children, authState, menuButton, history }}/>)
})

export function Component({children, authState, menuButton, history}) {

  function backButtonOrMenu() {
    if (menuButton === 'back') {
      if (history && history.length > 0) {
        return (<a><i className="material-icons" onClick={()=>history.goBack()}>arrow_back</i></a>)
      }
      return (<Link to='/'><i className="material-icons">arrow_back</i></Link>)
    } else if (menuButton === 'cancel') {
      return (<Link to='/'><span className="oi oi-x"></span></Link>)
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

      <div className="navbar-nav">
        {children}
      </div>

    </nav>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: '25px'
  },
  arrow: {
    color: '#fff',
    'font-size': '1.5em',
  },
  navBar: {
    backgroundColor: '#46ce84'
  },
});
