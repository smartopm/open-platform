// Logged in keeps track of the curent_user and current_member state
// and passes it along as a context
import React, {useReducer} from "react";
import gql from "graphql-tag";
import { useLazyQuery } from "react-apollo";

import { AUTH_TOKEN_KEY } from "../../utils/apollo";

export const MEMBER_ID_KEY = "CURRENT_MEMBER_ID";

const initialState = {
  user: null,
  member: null,
  members: [],
  loggedIn: false
};

const QUERY = gql`
  {
    currentUser {
      id
      email
      name
      userType
      phoneNumber
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

export default function AuthToken({ children }) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  // TODO: clean this up
  function setToken({action, token}) {
    if (action === 'delete') {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      window.location.href = '/'
    } else {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      window.location.href = '/'
    }
  }

  return (
    <AuthStateProvider token={token} setToken={setToken}>
      {children}
    </AuthStateProvider>
  );
}

const AuthStateContext = React.createContext(initialState);
export const Consumer = AuthStateContext.Consumer;
export const Context = AuthStateContext;

// Provider is the default export
export function AuthStateProvider({ children, token, setToken}) {
  const state = {
    loggedIn: false,
    user: null,
    token,
    setToken,
  };
  console.log("AuthStateProvier", state, token)
  const [loadQuery, { called, loading, error, data }] = useLazyQuery(QUERY);


  if (!called && token) {
    console.log('loadQUery')
    loadQuery()
  }
  if (loading) return false;

  if (!error && data) {
    state.loggedIn = true
    state.user = data.currentUser
  }

  console.log("Render", state)

  return (
    <AuthStateContext.Provider value={state}>
      {children}
    </AuthStateContext.Provider>
  );
}
