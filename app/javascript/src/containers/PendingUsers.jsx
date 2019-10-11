import React from 'react';
import { Link } from "react-router-dom";
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { StyleSheet, css } from 'aphrodite';

import Loading from "../components/Loading.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const QUERY = gql`
{
  results: pendingUsers {
    id
    userType
    name
    state
    roleName
    imageUrl
  }
}
`;

function Results({data, loading}) {

  function memberList(users) {
    return users.map((user) =>
      <Link to={`/user/${user.id}/edit`} key={user.id} className={css(styles.link)}>
        <div className='d-flex flex-row align-items-center py-2'>
          <div className={`${css(styles.avatar)}`}>
            <img src={user.imageUrl} className={css(styles.avatarImg)}/>
          </div>
          <div className={`px-3 w-100`}>
              <h6 className={css(styles.title)}>{ user.name }</h6>
              <small className={css(styles.small)}> {user.roleName} </small>
          </div>
          <div className={`px-2 align-items-center`}>
            <StatusBadge label={'Pending'} />
          </div>
        </div>
      </Link>
      )
  }
  if (loading) {
    return <Loading />
  }

  if (data) {
    return (
      <div className={`col-12 ${css(styles.results)}`}>
        {memberList(data.results)}
      </div>
      )
  }
  return false
}

export default () => {

  const { loading, error, data } = useQuery(QUERY, {variables: {name}});
  if (error) return `Error! ${error}`;
  console.log(data)

  return (
    <div className="container">
      <div className={`row justify-content-center ${css(styles.inputGroup)}`}>
        <Results {...{data, loading}} />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  results: {
    margin: "1em 0",
    padding: 0,
  },
  link: {
    'text-decoration': 'none',
    'color': '#222',
    ':hover': {
      'text-decoration': 'none',
      'color': '#222',
    }
  },
  title: {
    color: '#222',
    'font-size':'0.9em',
    lineHeight: '0.5em',
    margin: '0.5em 0 0 0',
  },
  small: {
    'font-size':'0.8em',
    color: '#666',
  },
  avatar: {
  },
  vertCenter: {
    alignItems: 'center',
  },
  avatarImg: {
    'border-radius': '50%',
    width: '50px',
  },
  statusBadgePending: {
    border: '1px dashed #46ce84',
    color: '#46ce84',
    borderRadius: '10px',
  },
})
