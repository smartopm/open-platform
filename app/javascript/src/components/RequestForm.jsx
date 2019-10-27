import React from "react";
import { StyleSheet, css } from "aphrodite";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { reasons } from "../utils/constants";
import { useFileUpload } from "../graphql/useFileUpload";
import { useApolloClient } from "react-apollo";

export default function RequestForm(props) {
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
  console.log(uploadUrl);
  console.log(signedBlobId);

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
              <input
                type="hidden"
                name=""
                defaultValue={url ? values.url : ""}
              />
            </div>
          )}
        </div>
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
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="Vehicle">
            Vehicle
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.vehicle}
            name="Vehicle"
          />
          {errors.vehicle && touched.vehicle ? (
            <div>{errors.vehicle}</div>
          ) : null}
        </div>
        <div className="form-group">
          <div className={`${css(styles.photoUpload)} `}>
            <input
              type="file"
              accepts="image/*"
              capture
              id="file"
              onChange={onChange}
              className={`${css(styles.fileInput)}`}
            />
            <PhotoCameraIcon />
            <label htmlFor="file">Take picture of your ID</label>
          </div>
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
