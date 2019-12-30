import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, MenuItem } from "@material-ui/core";
import { css, StyleSheet } from "aphrodite";
import { infoSource } from "../../utils/constants";

// Name
// Surname
// NRC
// Contact information
// Phone number
// Preferred email
// Mailing address
// Reason for Visit
// How did You Learn About Nkwashi (drop down)

export default function ClientForm() {
  const { register, handleSubmit, errors } = useForm();
  const [isSubmitted, setSubmitted] = useState(false);

  const onSubmit = data => console.log(data);

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            ref={register}
            name="name"
            defaultValue="Name"
            placeholder="Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            ref={register}
            name="surname"
            defaultValue="Surname"
            placeholder="Surname"
            required
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            ref={register}
            name="nrc"
            defaultValue="NRC"
            placeholder="NRC"
            required
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            ref={register}
            name="phone_number"
            defaultValue="Phone Number"
            placeholder="Phone Number"
            required
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            ref={register}
            name="reason"
            placeholder="Reason for visit"
            required
          />
        </div>
        <div className="form-group">
          <TextField
            id="reason"
            select
            label="How did You Learn About Nkwashi"
            name="reason"
            className={`${css(styles.selectInput)}`}
          >
            {infoSource.map(reason => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="row justify-content-center align-items-center ">
          <Button
            variant="contained"
            className={`btn ${css(styles.logButton)}`}
            onClick={handleSubmit}
            disabled={isSubmitted}
          >
            {isSubmitted ? "Submitting ..." : " Check In"}
          </Button>
        </div>
      </form>
    </div>
  );
}
const styles = StyleSheet.create({
  welcomePage: {
    position: " absolute",
    left: " 50%",
    top: " 50%",
    "-webkit-transform": " translate(-50%, -50%)",
    transform: " translate(-50%, -50%)"
  },
  logButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    width: "75%",
    boxShadow: "none",
    marginTop: 60,
    height: 50
  },
  selectInput: {
    width: "100%"
  }
});
