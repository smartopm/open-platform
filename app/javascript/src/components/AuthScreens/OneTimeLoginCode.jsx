eslint-disable
import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { useMutation } from "react-apollo";
import { loginPhoneConfirmCode } from "../../graphql/mutations";
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";

export default function OneTimeLoginCode({ match }) {
  const { id, code } = match.params;
  const authState = useContext(AuthStateContext);
  const [error, setError] = useState(null);
  const [loginPhoneComplete, { called }] = useMutation(loginPhoneConfirmCode);

  // If logged in, redirect to dashboard
  if (authState.loggedIn) {
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
