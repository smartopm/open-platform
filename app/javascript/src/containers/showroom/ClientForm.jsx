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
      <div className="row justify-content-center align-items-center">
        <h3>Nkwashi Showroom Check-In</h3>

        <p className={css(styles.infoText)}>
          Please enter your contact information below so that we can follow-up
          with you after today’s meeting and to more quickly set you up for
          access at the gate when you visit Nkwashi in-person
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="name">
            NAME
          </label>
          <input
            className="form-control"
            type="text"
            ref={register}
            name="name"
            defaultValue=""
            required
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="surname">
            Surname
          </label>
          <input
            className="form-control"
            type="text"
            ref={register}
            name="surname"
            defaultValue=""
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
            ref={register}
            name="nrc"
            defaultValue=""
            required
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="phone_number">
            Phone Number
          </label>
          <input
            className="form-control"
            type="text"
            ref={register}
            name="phone_number"
            defaultValue=""
            required
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="reason">
            Reason for Visit
          </label>
          <input
            className="form-control"
            type="text"
            ref={register}
            name="reason"
            defaultValue=""
            required
          />
        </div>
        <div className="form-group">
          <TextField
            id="reason"
            select
            label="How did You Learn About Nkwashi"
            name="reason"
            value=""
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
            type="submit"
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
  },
  infoText: {
    marginBottom: 40,
    marginTop: 50,
    color: "#818188"
  }
});
