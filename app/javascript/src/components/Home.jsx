import React, {useContext} from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { Link } from "react-router-dom";

import {Context as AuthStateContext} from './Provider/AuthStateProvider.js';
import Loading from "./Loading.jsx";

export default ({match}) => {
  const authState = useContext(AuthStateContext)
  if (!authState.loggedIn) return <Loading />;
  return (<Component authState={authState} />)
}

export function Component({ authState }) {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-4-lg col-12-sm index-cards">
          <div className="d-flex flex-row flex-wrap justify-content-center mb-3">
            <div className="card align-self-center text-center">
              <div className="card-body">
                <h5 className="card-title"><span className="oi oi-person"></span></h5>
                <Link to={`/id/${authState.member.id}`} className={`card-link`}>Identify</Link>
              </div>
            </div>
            <div className="card align-self-center text-center">
              <div className="card-body">
                <h5 className="card-title"><span className="oi oi-key"></span></h5>
                <Link to="/" className={`card-link`}>Request</Link>
              </div>
            </div>
            <div className="card align-self-center text-center">
              <div className="card-body">
                <h5 className="card-title"><span className="oi oi-dollar"></span></h5>
                <Link to="/" className={`card-link`}>Pay</Link>
              </div>
            </div>
            <div className="card align-self-center text-center">
              <div className="card-body">
                <h5 className="card-title"><span className="oi oi-map"></span></h5>
                <Link to="/" className={`card-link`}>Map</Link>
              </div>
            </div>
            <div className="card align-self-center text-center">
              <div className="card-body">
                <h5 className="card-title"><span className="oi oi-phone"></span></h5>
                <Link to="/scan" className={`card-link`}>Scan</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
