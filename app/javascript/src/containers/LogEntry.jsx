import React, { Fragment, useState } from "react";
import Nav from "../components/Nav";

export default function LogEntry() {
  const [state, setState] = useState("");
  function handleInputChange(e) {
    setState(e.target.value);
  }
  return (
    <Fragment>
      <Nav navName="Log Entry" menuButton="Cancel" />
      <div className="form-group">
        <label className="bmd-label-static" htmlFor="firstName">
          Name
        </label>
        <input
          className="form-control"
          type="text"
          onChange={handleInputChange}
          value={state}
          name="name"
          required
        />
      </div>
    </Fragment>
  );
}
