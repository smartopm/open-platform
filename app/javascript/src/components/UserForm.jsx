import React from "react";
import { StyleSheet, css } from "aphrodite";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { reasons, userState, userType } from "../utils/constants";

export default function UserForm(props) {
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
            Name
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            name="name"
          />
          {errors.name && touched.name ? <div>{errors.name}</div> : null}
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="email">
            Email
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            name="email"
          />
          {errors.email && touched.email ? <div>{errors.email}</div> : null}
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phoneNumber}
            name="phoneNumber"
          />
          {errors.phoneNumber && touched.phoneNumber ? (
            <div>{errors.phoneNumber}</div>
          ) : null}
        </div>
        <div className="form-group">
          <TextField
            id="reason"
            select
            label="Reason"
            value={values.requestReason || ""}
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
        <div className="form-group">
          <TextField
            id="userType"
            select
            label="User Type"
            value={values.userType || ""}
            onChange={handleChange("userType")}
            margin="normal"
            className={`${css(styles.selectInput)}`}
          >
            {userType.map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {errors.userType && touched.userType ? (
            <div>{errors.userType}</div>
          ) : null}
        </div>

        <div className="form-group">
          <TextField
            id="state"
            select
            label="State"
            value={values.state || ""}
            onChange={handleChange("state")}
            margin="normal"
            className={`${css(styles.selectInput)}`}
          >
            {userState.map(state => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
          {errors.state && touched.state ? <div>{errors.state}</div> : null}
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
