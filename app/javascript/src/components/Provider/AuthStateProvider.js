// Logged in keeps track of the curent_user and current_member state
// and passes it along as a context
import React, { useState } from "react";
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

export const MEMBER_ID_KEY = 'CURRENT_MEMBER_ID'

const initialState = {
  user: null,
  member: null,
  members: [],
  loggedIn: false,
}

const QUERY = gql`
{
  currentUser {
    id
    email
    name
    members {
      id
      expiresAt
      memberType
      community {
        name
        logoUrl
      }
    }
  }
}
`;

const AuthStateContext = React.createContext(initialState);
export const Consumer = AuthStateContext.Consumer
export const Context = AuthStateContext

// Provider is the default export
export default function AuthStateProvider({children}) {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return false;
  if (error) return false;

  console.log(data)
  const user = data.currentUser
  const members = data.currentUser.members
  const state = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    members: members,
    loggedIn: true,
  }
  if (members.length > 0) {
    state.member = members[0]
    // TODO: @mdp find a better way to do this
    window.localStorage.setItem(MEMBER_ID_KEY, state.member.id)
  }

  return (
    <AuthStateContext.Provider value={state}>
      {children}
    </AuthStateContext.Provider>
  )
}
