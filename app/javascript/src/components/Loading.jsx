import React from 'react';

export default function Loading(props) {
  return (
    <div className="row align-items-center">
      <div className="d-flex col-12 justify-content-center">
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    </div>
  );
}
