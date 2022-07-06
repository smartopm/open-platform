/* eslint-disable */
// Logged in keeps track of the curent_user and current_member state
// and passes it along as a context
import React, { useReducer, useState, useEffect } from 'react';

import gql from 'graphql-tag';
import { useApolloClient } from 'react-apollo';

import { AUTH_TOKEN_KEY } from '../../utils/apollo';
import Loading from '../../shared/Loading';
import CenteredContent from '../../shared/CenteredContent';

export const MEMBER_ID_KEY = 'CURRENT_MEMBER_ID';

const initialState = {
  user: null,
  member: null,
  members: [],
  loggedIn: false,
  token: null
};

const QUERY = gql`
  {
    currentUser {
      id
      email
      name
      userType
      roleName
      status
      phoneNumber
      expiresAt
      imageUrl
      avatarUrl
      subStatus
      paymentPlan
      permissions {
        module
        permissions
      }
      community {
        id
        name
        logoUrl
        timezone
        supportNumber
        supportEmail
        supportWhatsapp
        socialLinks
        menuItems
        leadMonthlyTargets
        imageUrl
        currency
        locale
        language
        wpLink
        themeColors
        features
        securityManager
        subAdministrator {
          id
          name
        }
        bankingDetails
        communityRequiredFields
        smsPhoneNumbers
        emergencyCallNumber
        features
        roles
        leadMonthlyTargets
        paymentKeys
        supportedLanguages
      }
    }
  }
`;

export default function AuthToken({ children }) {
  function reducer(_state, action) {
    switch (action.type) {
      case 'delete':
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
    token: localStorage.getItem(AUTH_TOKEN_KEY)
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
  return client.query({
    query: QUERY,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });
}

// Provider is the default export
export function AuthStateProvider({ children, token, setToken }) {
  const client = useApolloClient();
  const [state, setState] = useState({
    loggedIn: false,
    loaded: false,
    user: null,
    token: null,
    setToken
  });

  useEffect(() => {
    // Reset state while we evaluate a token change
    setState({ ...state, user: null, loaded: false });
    if (token && !state.error) {
      getCurrentUser(client)
        .then(({ data }) => {
          setState({
            ...state,
            user: data.currentUser,
            loaded: true,
            loggedIn: true,
            token: token
          });
        })
        .catch(err => {
          setState({ ...state, error: err });
        });
    } else {
      setState({ ...state, user: null, loaded: true, loggedIn: false });
    }
    // Get query if token changes
    // /* eslint-disable */-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (state.error && token) {
    // There's an error with the token, delete it
    setToken({ type: 'delete' });
  }

  if (!state.loaded) {
    return <Loading />;
  }

  return <AuthStateContext.Provider value={state}>{children}</AuthStateContext.Provider>;
}
