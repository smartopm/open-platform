import React, {useContext} from "react";
import { Redirect } from "react-router-dom";
import { Context as AuthStateContext } from "../../containers/Provider/AuthStateProvider";

export default function GoogleAuthCallback({match}) {
  const token = match.params.token
  const authState = useContext(AuthStateContext);
  console.info("GoogleAuthCallback", authState)
  if (token && !authState.loggedIn && !authState.error) {
    console.info("GoogleAuthCallback", "Logging in user with token")
    authState.setToken({type:'update', token})
    return <></>; // Wait for the Token update to hit and handle the redirect
  }
  return <Redirect push to='/' />;
}

