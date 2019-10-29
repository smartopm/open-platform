import React, { useContext } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { StyleSheet, css } from "aphrodite";
import { reasons, userState, userType } from "../utils/constants";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { FormContext } from "../containers/UserEdit";

export default function UserForm() {

 const {values, handleInputChange, handleFileUpload, imageUrl, status} = useContext(FormContext) 
  
  return (
    <div className="container">
      <form>
        <div className="form-group">
          {
          status === "DONE" ? (
            <img
              src={imageUrl}
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
                onChange={handleFileUpload}
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
            onChange={handleInputChange}
            defaultValue={values.name}
            name="name"
            required
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="email">
            Email
          </label>
          <input
            className="form-control"
            name="email"
            type="email"
            onChange={handleInputChange}
            defaultValue={values.email || ""}
            required

          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            className="form-control"
            type="text"
            onChange={handleInputChange}
            defaultValue={values.phoneNumber || ""}
            name="phoneNumber"
            required
          />
         
        </div>
        <div className="form-group">
          <TextField
            id="reason"
            select
            label="Reason"
            name="requestReason"
            value={values.requestReason || ""}
            onChange={handleInputChange}
            margin="normal"
            className={`${css(styles.selectInput)}`}
          >
            {reasons.map(reason => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>
          
        </div>
        <div className="form-group">
          <TextField
            id="userType"
            select
            label="User Type"
            value={values.userType || "" }
            onChange={handleInputChange}
            margin="normal"
            name="userType"
            className={`${css(styles.selectInput)}`}
          >
            {userType.map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="form-group">
          <TextField
            id="state"
            select
            label="State"
            value={values.state || ""}
            onChange={handleInputChange}
            margin="normal"
            name="state"
            className={`${css(styles.selectInput)}`}
          >
            {userState.map(state => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
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
