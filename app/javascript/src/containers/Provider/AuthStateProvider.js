// Logged in keeps track of the curent_user and current_member state
// and passes it along as a context
import React from "react";
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
    userType
    expiresAt
    imageUrl
    avatarUrl
    community {
      name
      logoUrl
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

  const user = data.currentUser
  const state = {
    user,
    loggedIn: true,
  }

  return (
    <AuthStateContext.Provider value={state}>
      {children}
    </AuthStateContext.Provider>
  )
}
