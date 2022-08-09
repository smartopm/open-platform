/* eslint-disable */
import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhoneConfirmCode } from "../../graphql/mutations";
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";
import { AUTH_FORWARD_URL_KEY } from "../../utils/apollo";

/* istanbul ignore next */
export default function OneTimeLoginCode({ match }) {
  const { id, code, type, requestId } = match.params;
  const authState = useContext(AuthStateContext);
  const [error, setError] = useState(null);
  const [loginPhoneComplete, { called }] = useMutation(loginPhoneConfirmCode);

  // If logged in, redirect to dashboard
  if (authState.loggedIn) {
    if (authState.user.status === 'deactivated') return <Redirect push to='/logout' />
    if(type === 'request') return <Redirect push to={`/qr/invite/${requestId}`} />;

    const nextUrlAfterOneTimeLogin = localStorage.getItem(AUTH_FORWARD_URL_KEY)
    if (nextUrlAfterOneTimeLogin) return <Redirect push to={`${nextUrlAfterOneTimeLogin}`} />;
    
    return <Redirect push to="/" />;
  }

  if (error || authState.error) {
    return <div>{error || authState.error}</div>;
  }

  if (!called) {
    loginPhoneComplete({
      variables: { id, token: code }
    })
      .then(({ data }) => {
        authState.setToken({
          type: "update",
          token: data.loginPhoneComplete.authToken
        });
      })
      .catch(error => {
        setError(error.message);
      });
  }

  return <></>; // Wait for the auth state to update and bypass this block
}
