import React from 'react';

export default function Nav(props) {
  return (
    <div>
      <nav className="navbar navbar-dark" style={{backgroundColor: '#46ce84'}}>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
        </div>

        <ul className="nav navbar-nav navbar-center">
          <li><a href="#">Community</a></li>
        </ul>
      </nav>
      {props.children}
    </div>
  );
}

