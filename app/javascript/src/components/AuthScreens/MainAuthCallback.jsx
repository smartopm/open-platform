/* eslint-disable */
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";

/* istanbul ignore next */
export default function MainAuthCallback({ match }) {
  const token = match.params.token;
  const authState = useContext(AuthStateContext);
  if (token && !authState.loggedIn && !authState.error) {
    authState.setToken({ type: "update", token });
    return <></>; // Wait for the Token update to hit and handle the redirect
  }
  if(authState?.user?.status === 'deactivated'){
    return <Redirect push to="/logout" />;
  }
  return <Redirect push to="/" />;
}
