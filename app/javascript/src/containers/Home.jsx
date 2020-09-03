/* eslint-disable */
/* eslint-disable */
import React, { useContext, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import ScanIcon from '../../../assets/images/shape.svg'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import Nav from '../components/Nav'
import Loading from '../components/Loading.jsx'
import Homepage from '../components/HomePage'

export default function Home() {
  const [redirect, setRedirect] = useState(false)
  const authState = useContext(AuthStateContext)
  function inputToSearch() {
    setRedirect('/search')
  }

  
  if (redirect) {
    return (
      <Redirect
        push
        to={{
          pathname: redirect,
          state: { from: '/' }
        }}
      />
    )
  }
  if (!authState.loggedIn) return <Loading />
  return (
    <>
      <Nav>
        {['security_guard', 'admin', 'custodian'].includes(
          authState.user.userType.toLowerCase()
        ) && (
          <div className={css(styles.inputGroup)}>
            <input
              className={`form-control ${css(styles.input)}`}
              onFocus={inputToSearch}
              type="text"
              placeholder="Search"
            />
            <i className={`material-icons ${css(styles.searchIcon)}`}>search</i>
            <Link to="/scan">
              <img
                src={ScanIcon}
                alt="scan icon"
                className={` ${css(styles.scanIcon)}`}
              />
            </Link>
          </div>
        )}
      </Nav>
      <Homepage authState={authState} />
    </>
  )
}

const styles = StyleSheet.create({
  inputGroup: {
    position: 'relative'
  },
  input: {
    marginTop: '1em',
    padding: '0.5em 1em 0.5em 2em',
    height: 40,
    color: '#222',
    border: 'none',
    borderRadius: '5px',
    backgroundImage: 'none',
    backgroundColor: '#FFF',
    '::placeholder': {
      color: '#999'
    }
  },
  searchIcon: {
    color: '#999',
    position: 'absolute',
    left: 4,
    top: 26,
    bottom: '4px',
    'z-index': 9
  },
  scanIcon: {
    position: 'absolute',
    top: 26,
    bottom: 4,
    right: 5,
    width: 20
  }
})
