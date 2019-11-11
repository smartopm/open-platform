import React, { Fragment, useState } from "react";
import Nav from "../components/Nav";

export default function LogEntry() {
  const [state, setState] = useState("");

  function handleInputChange(e) {
    const [name, value] = e.target;
    setState({
      [name]: value
    });
  }

  return (
    <Fragment>
      <Nav navName="New Log" menuButton="Cancel" />
      <div className="container">
        <form>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="firstName">
              NAME
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={state.name}
              name="name"
              required
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="nrc">
              NRC
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={state.nrc}
              name="nrc"
              required
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="phoneNumber">
              Phone N&#176;
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={state.phoneNumber}
              name="phoneNumber"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="vehicle">
              VEHICLE PLATE N&#176;
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={state.vehicle}
              name="vehicle"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="business">
              BUSINESS
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={state.business}
              name="business"
            />
          </div>
        </form>
      </div>
    </Fragment>
  );
}
