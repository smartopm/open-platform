import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useLazyQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { StyleSheet, css } from 'aphrodite';

import Loading from "./Loading.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const QUERY = gql`
query MemberSearch($name: String!) {
  memberSearch(name: $name) {
    id
    memberType
    user {
      imageUrl
      id
      name
    } } }
`;

function Results({data, loading, called}) {

  function memberList(members) {
    return members.map((member) =>
      <Link to={`/id_verify/${member.id}`} key={member.id} className={css(styles.link)}>
        <div className='d-flex flex-row align-items-center py-2'>
          <div className={`${css(styles.avatar)}`}>
            <img src={member.user.imageUrl} className={css(styles.avatarImg)}/>
          </div>
          <div className={`px-3 w-100`}>
              <h6 className={css(styles.title)}>{ member.user.name }</h6>
              <small className={css(styles.small)}> {member.memberType} </small>
          </div>
          <div className={`px-2 align-items-center`}>
            <StatusBadge label={'Valid'} />
          </div>
        </div>
      </Link>
      )
  }
  if (called && loading) {
    return <Loading />
  }

  if (called && data) {
    return (
      <div className={`col-12 ${css(styles.results)}`}>
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
