import React, {useContext, useState} from 'react';
import { Link, Redirect } from "react-router-dom";
import { StyleSheet, css } from 'aphrodite';
import Nav from './Nav'

import {Context as AuthStateContext} from './Provider/AuthStateProvider.js';
import Loading from "./Loading.jsx";

export default function Home() {
  const authState = useContext(AuthStateContext)
  if (!authState.loggedIn) return <Loading />;
  return (<Component authState={authState} />)
}

export function Component({ authState }) {
  const [redirect, setRedirect] = useState(false)

  function inputToSearch() {
    setRedirect('/search')
  }

  if (redirect) {
    return <Redirect push to={redirect} />
  }

  return (
    <div>
      <Nav>
        <div className={css(styles.inputGroup)}>
          <input className={`form-control ${css(styles.input)}`} onFocus={inputToSearch} type="text" placeholder="Search" />
          <i className={`material-icons ${css(styles.searchIcon)}`}>search</i>
        </div>
      </Nav>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4-lg col-12-sm index-cards">
            <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
              <div className="card align-self-center text-center">
                <Link to={`/id/${authState.member.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title"><i className="material-icons">perm_identity</i></h5>
                    <p>Identify</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to={`/id/${authState.member.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title"><i className="material-icons">perm_identity</i></h5>
                    <p>Request</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to={`/id/${authState.member.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title"><i className="material-icons">payment</i></h5>
                    <p>Pay</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to={`/id/${authState.member.id}`} className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title"><i className="material-icons">directions</i></h5>
                    <p>Map</p>
                  </div>
                </Link>
              </div>
              <div className="card align-self-center text-center">
                <Link to='/scan' className={`card-link`}>
                  <div className="card-body">
                    <h5 className="card-title"><i className="material-icons">photo_camera</i></h5>
                    <p>Scan</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    position: 'relative',
  },
  input: {
    marginTop: '1em',
    padding: '0.5em 1em 0.5em 2em',
    height: '30px',
    color: '#222',
    border: 'none',
    backgroundImage: 'none',
    backgroundColor: '#FFF',
    '::placeholder': {
        color: '#999'
    }
  },
  searchIcon: {
    color: '#999',
    position: 'absolute',
    left: '4px',
    top: '20px',
    bottom: '4px',
    'z-index': 9,
  },
})
