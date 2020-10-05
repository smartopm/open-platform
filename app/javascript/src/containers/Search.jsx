/* eslint-disable */
import React, { useState, Fragment, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useLazyQuery } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import Loading from '../components/Loading.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Avatar from '../components/Avatar.jsx'
import ScanIcon from '../../../assets/images/shape.svg'
import { Button } from '@material-ui/core'
import ErrorPage from '../components/Error.jsx'
import { Context } from './Provider/AuthStateProvider.js'
import CenteredContent from '../components/CenteredContent.jsx'
import { UserSearchQuery } from '../graphql/queries.js'

export function NewRequestButton() {
  return (
    <CenteredContent>
      <Link className={css(styles.requestLink)} to="/new/user">
        <Button
          variant="contained"
          className={`btn ${css(styles.requestButton)}`}
        >
          Create a new request
        </Button>
      </Link>
    </CenteredContent>
  )
}

export function Results({ data, loading, called, authState }) {
  function memberList(users) {
    return (
      <Fragment>
        {users.map(user => (
          <Link
            to={`/user/${user.id}`}
            key={user.id}
            data-testid="link_search_user"
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
  const [offset, setOffset] = useState(0)
  const [name, setName] = useState('')
  const limit = 50

  function updateSearch(e) {
    const { value } = e.target
    setName(value)
  }

  function handleSearch(event){
    if(event.keyCode == 13){
      loadGQL({
        variables: { query: name, limit, offset },
        errorPolicy: 'all'
      })
    }
  }
  const [loadGQL, { called, loading, error, data, fetchMore }] = useLazyQuery(
    UserSearchQuery
  )
  const authState = useContext(Context)

  function loadMoreResults() {
    fetchMore({
      variables: { query: name, offset: data.userSearch.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return Object.assign({}, prev, {
          userSearch: [...prev.userSearch, ...fetchMoreResult.userSearch]
        })
      }
    })
    // Allow next search to go through all records
    setOffset(0)
  }

  if (
    !['security_guard', 'admin', 'custodian'].includes(
      authState.user.userType.toLowerCase()
    )
  ) {
    return <Redirect to="/" />
  }
  if (error && !error.message.includes('permission')) {
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
          onKeyDown={handleSearch}
        />
        <Link
          to={(location.state && location.state.from) || '/'}
          className={css(styles.cancelBtn)}
        >
          <i className="material-icons">arrow_back</i>
        </Link>
        <Link to="/scan">
          <img
            src={ScanIcon}
            alt="scan icon"
            className={` ${css(styles.scanIcon)}`}
          />
        </Link>

        {name.length > 0 && (
          <>
            <Results {...{ data, loading, called, authState }} />
            {Boolean(called && data && data.userSearch.length) && (
              <Button
                data-testid="prev-btn"
                onClick={loadMoreResults}
                disabled={false}
              >
                Load more
              </Button>
            )}
          </>
        )}
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
    border: '1px dashed #69ABA4',
    color: '#69ABA4',
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
    backgroundColor: '#69ABA4',
    color: '#FFF'
  },
  requestLink: {
    textDecorationLine: 'none'
  }
})
