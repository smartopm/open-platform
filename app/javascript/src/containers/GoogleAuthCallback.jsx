import React, {useContext} from "react";
import { Redirect } from "react-router-dom";
import { Context as AuthStateContext } from "./Provider/AuthStateProvider";

export default function GoogleAuthCallback({match}) {
  console.log(match)
  if (match.params.token) {
    console.info("GoogleAuthCallback", "Logging in user with token")
    const authState = useContext(AuthStateContext);
    console.info("GoogleAuthCallback", authState)
    authState.setToken({action:'update', token: match.params.token})
  }
  return <Redirect push to='/' />;
}

