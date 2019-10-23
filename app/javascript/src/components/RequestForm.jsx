import React from "react";
import { StyleSheet, css } from "aphrodite";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { reasons } from "../utils/constants";

export default function RequestForm(props) {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched
  } = props;
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="firstName">
            First Name
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.firstName}
            name="firstName"
          />
          {errors.firstName && touched.firstName ? (
            <div>{errors.firstName}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.lastName}
            name="lastName"
          />
          {errors.lastName && touched.lastName ? (
            <div>{errors.lastName}</div>
          ) : null}
        </div>
        <div className="form-group">
          <TextField
            id="reason"
            select
            label="Reason"
            value={values.requestReason}
            onChange={handleChange("requestReason")}
            margin="normal"
            className={`${css(styles.selectInput)}`}
          >
            {reasons.map(reason => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>
          {errors.requestReason && touched.requestReason ? (
            <div>{errors.requestReason}</div>
          ) : null}
        </div>
      </form>
    </div>
  );
}

const styles = StyleSheet.create({
  selectInput: {
    width: "100%"
  }
});
