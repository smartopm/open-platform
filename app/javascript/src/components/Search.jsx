import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useLazyQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { StyleSheet, css } from 'aphrodite';

import Loading from "./Loading.jsx";

const QUERY = gql`
query MemberSearch($name: String!) {
  memberSearch(name: $name) {
    id
    memberType
    user {
      id
      name
    }
  }
}
`;

function Results({data, loading, called}) {

  function memberList(members) {
    return members.map((member) =>
      <Link to={`/id_verify/${member.id}`} key={member.id} className={css(styles.hover)}>
        <div className={`card ${css(styles.card)}`}>
          <h6 className="card-title">{ member.user.name }</h6>
          <small>{member.memberType}</small>
        </div>
      </Link>
      )
  }
  if (called && loading) {
    return <Loading />
  }

  if (called && data) {
    return (
      <div className="col-10 col-sm-10 col-md-10">
        {memberList(data.memberSearch)}
      </div>
      )
  }
  return false
}

export default () => {

  function updateSearch(e) {
    const {value} = e.target
    loadGQL()
    setName(value)
  }

  const [name, setName] = useState('')
  const [loadGQL, { called, loading, error, data }] = useLazyQuery(QUERY, {variables: {name}});
  if (error) return `Error! ${error}`;

  return (
    <div className="container">
      <div className={`row justify-content-center ${css(styles.inputGroup)}`}>
        <input className={`form-control ${css(styles.input)}`} onChange={updateSearch} type="text" placeholder="Search" value={name} autoFocus />
        <Link to='/' className={css(styles.cancelBtn)}>
          <i className="material-icons">arrow_back</i>
        </Link>

        {name.length > 0 &&
          <Results {...{data, loading, called}}/>
        }
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  hover: {
    ':hover': {
      'text-decoration': 'none',
      'color': '#222',
    }
  },
  card: {
    color: '#222',
    margin: '2em 0',
    padding: '0.75em',
    h6: {
      'font-size':'1.2em',
    },
  },
  inputGroup: {
    border: '1px solid #AAA',
    'border-radius': '5px',
    position: 'relative',
    height: '48px',
    backgroundColor: '#FFF',
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
    'z-index': 9,
  },
})
