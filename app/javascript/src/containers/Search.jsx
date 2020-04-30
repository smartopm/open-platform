import React, { useState, Fragment, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useLazyQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { StyleSheet, css } from 'aphrodite'
import Loading from '../components/Loading.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Avatar from '../components/Avatar.jsx'
import ScanIcon from '../../../assets/images/shape.svg'
import { Button } from '@material-ui/core'
import ErrorPage from '../components/Error.jsx'
import { Context } from './Provider/AuthStateProvider.js'

const QUERY = gql`
  query UserSearch($query: String!) {
    userSearch(query: $query) {
      id
      userType
      name
      state
      roleName
      imageUrl
      avatarUrl
    }
  }
`

function NewRequestButton() {
  return (
    <div className="d-flex justify-content-center">
      <Link className={css(styles.requestLink)} to="/new/user">
        <Button
          variant="contained"
          className={`btn ${css(styles.requestButton)}`}
        >
          Create a new request
        </Button>
      </Link>
    </div>
  )
}

function Results({ data, loading, called }) {
  const authState = useContext(Context)
  function memberList(users) {
    return (
      <Fragment>
        {users.map(user => (
          <Link
            to={`/user/${user.id}`}
            key={user.id}
            className={css(styles.link)}
          >
            <div className="d-flex flex-row align-items-center py-2">
              <Avatar user={user} style="small" />
              <div className={`px-3 w-100`}>
                <h6 className={css(styles.title)}>{user.name}</h6>
                <small className={css(styles.small)}> {user.roleName} </small>
              </div>
              <div className={`px-2 align-items-center`}>
                <StatusBadge label={user.state} />
              </div>
            </div>
          </Link>
        ))}
        <br />
      </Fragment>
    )
  }
  if (called && loading) {
    return <Loading />
  }

  if (called && data) {
    return (
      <div className={`col-12 ${css(styles.results)}`}>
        {data.userSearch.length > 0 ? (
          memberList(data.userSearch)
        ) : (
            <div className={`${css(styles.noResults)}`}>
              <h4>No results found!</h4>
            </div>
          )}
        {/* only show this when the user is admin */}
        {authState.user.userType === 'admin' && <NewRequestButton />}
      </div>
    )
  }
  return false
}

export default function SearchContainer({ location }) {

  function updateSearch(e) {
    const { value } = e.target
    setName(value || '')
    if (value && value.length > 0) {
      loadGQL({ variables: { query: value } })
    }
  }

  const [name, setName] = useState('')
  const [loadGQL, { called, loading, error, data }] = useLazyQuery(QUERY)
  const authState = useContext(Context)

  if (!['security_guard', 'admin', 'custodian'].includes(authState.user.userType.toLowerCase())) {
    return <Redirect to='/' />
  }
  if (error) {
    return <ErrorPage title={error.message} />
  }

  return (
    <div className="container">
      <div className={`row justify-content-center ${css(styles.inputGroup)}`}>
        <input
          className={`form-control ${css(styles.input)}`}
          onChange={updateSearch}
          type="text"
          placeholder="Search"
          value={name}
          autoFocus
        />
        <Link to={location.state.from} className={css(styles.cancelBtn)}>
          <i className="material-icons">arrow_back</i>
        </Link>
        <Link to="/scan">
          <img
            src={ScanIcon}
            alt="scan icon"
            className={` ${css(styles.scanIcon)}`}
          />
        </Link>

        {name.length > 0 && <Results {...{ data, loading, called }} />}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  results: {
    margin: '1em 0',
    padding: 0
  },
  link: {
    'text-decoration': 'none',
    color: '#222',
    ':hover': {
      'text-decoration': 'none',
      color: '#222'
    }
  },
  title: {
    color: '#222',
    'font-size': '0.9em',
    lineHeight: '0.5em',
    margin: '0.5em 0 0 0'
  },
  small: {
    'font-size': '0.8em',
    color: '#666'
  },
  avatar: {},
  vertCenter: {
    alignItems: 'center'
  },
  avatarImg: {
    'border-radius': '50%',
    width: '50px'
  },
  statusBadgePending: {
    border: '1px dashed #25c0b0',
    color: '#25c0b0',
    borderRadius: '10px'
  },
  inputGroup: {
    border: '1px solid #AAA',
    'border-radius': '5px',
    position: 'relative',
    height: '48px',
    backgroundColor: '#FFF'
  },
  input: {
    height: '36px',
    border: 'none',
    width: '100%',
    padding: '0.7em 0 0em 3em',
    color: '#222',
    'background-image': 'none',
    '::placeholder': {
      color: '#999'
    }
  },
  cancelBtn: {
    color: '#666',
    position: 'absolute',
    left: '10px',
    top: '12px',
    bottom: '4px',
    'z-index': 9
  },
  scanIcon: {
    position: 'absolute',
    bottom: 4,
    right: 5,
    width: 24,
    height: 35
  },
  noResults: {
    margin: '4em 0',
    textAlign: 'center'
  },
  requestButton: {
    backgroundColor: '#25c0b0',
    color: '#FFF'
  },
  requestLink: {
    textDecorationLine: 'none'
  }
})
