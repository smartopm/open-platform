import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { StyleSheet, css } from "aphrodite";
import { reasons, userState, userType } from "../utils/constants";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { useFileUpload } from "../graphql/useFileUpload";
import { useApolloClient } from "react-apollo";

export default function UserForm(props) {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched
  } = props;
  const { onChange, status, url, uploadUrl, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {status === "DONE" && url ? (
            <img
              src={url}
              alt="uploaded picture"
              className={`${css(styles.uploadedImage)}`}
            />
          ) : (
            <div className={`${css(styles.photoUpload)}`}>
              <input
                type="file"
                accepts="image/*"
                capture
                id="file"
                onChange={onChange}
                className={`${css(styles.fileInput)}`}
              />
              <PhotoCameraIcon />
              <label htmlFor="file">Take a photo</label>
            </div>
          )}
        </div>
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
  },
  photoUpload: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    width: "40%"
  },
  fileInput: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    zIndex: -1,
    cursor: "pointer"
  },
  uploadedImage: {
    width: "40%",
    borderRadius: 8
  }
});
