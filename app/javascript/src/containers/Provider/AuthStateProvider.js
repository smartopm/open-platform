// Logged in keeps track of the curent_user and current_member state
// and passes it along as a context
import React, { useReducer, useState, useEffect } from "react";

import gql from "graphql-tag";
import { useApolloClient } from "react-apollo";

import { AUTH_TOKEN_KEY } from "../../utils/apollo";
import Loading from "../../components/Loading";

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
  function reducer(state, action) {
    console.log(state, action);
    switch (action.type) {
      case "delete":
        localStorage.removeItem(AUTH_TOKEN_KEY);
        return { token: null };
      default:
        if (action.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, action.token);
        }
        return { token: action.token };
    }
  }

  const [state, setToken] = useReducer(reducer, {
    token: localStorage.getItem(AUTH_TOKEN_KEY),
  });

  return (
    <AuthStateProvider token={state.token} setToken={setToken}>
      {children}
    </AuthStateProvider>
  );
}

const AuthStateContext = React.createContext(initialState);
export const Consumer = AuthStateContext.Consumer;
export const Context = AuthStateContext;

// Returns a promise with currentUser query
function getCurrentUser(client) {
  return client.query({ query: QUERY, fetchPolicy: "no-cache" });
}

function googleLogUser(user) {
  if(user) {
    gtag('set', {'user_id': user.id})
    gtag('set', 'user_properties', { Role: user.userType });
  }
}

// Provider is the default export
export function AuthStateProvider({ children, token, setToken }) {
  const client = useApolloClient();
  const [state, setState] = useState({
    loggedIn: false,
    loaded: false,
    user: null,
    setToken
  });


  useEffect(() => {
    // Reset state while we evaluate a token change
    setState({ ...state, user: null, loaded: false });
    if (token && !state.error) {
      getCurrentUser(client)
        .then(({ data }) => {
          googleLogUser(data.currentUser)
          setState({
            ...state,
            user: data.currentUser,
            loaded: true,
            loggedIn: true,
          });
        })
        .catch(err => {
          setState({ ...state, error: err });
        });
    } else {
      setState({ ...state, user: null, loaded: true });
    }
    // Get query if token changes
  }, [token]);

  if (state.error && token) {
    // There's an error with the token, delete it
    setToken({ type: "delete" });
  }

  if (!state.loaded) {
    return <Loading />;
  }

  return (
    <AuthStateContext.Provider value={state}>
      {children}
    </AuthStateContext.Provider>
  );
}
