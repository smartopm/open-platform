import React, { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, MenuItem } from "@material-ui/core";
import { css, StyleSheet } from "aphrodite";
import { useMutation } from "react-apollo";
import { infoSource } from "../../utils/constants";
import { Footer } from "../../components/Footer";
import Nav from "../../components/Nav";
import { EntryRequestCreate } from "../../graphql/mutations.js";

export default function ClientForm({history}) {
  const { register, handleSubmit, errors, setValue } = useForm();
  const [isSubmitted, setSubmitted] = useState(false);
  const [selectedSource, setReason] = useState("")
  const [createEntryRequest] = useMutation(EntryRequestCreate);
  const onSubmit = data => {
    // setSubmitted(!isSubmitted);
    const user = {
      name: data.name + data.surname.toUpperCase(),
      phoneNumber: data.phoneNumber,
      nrc: data.nrc,
      reason: data.reason,
      // source: selectedSource,
      subject: "showroom"
    };
    // history.push("/sh_complete");
    createEntryRequest({ variables: user }).then(() => {
      // Send them to the temp final page
      history.push("/sh_complete/");
    });
  };

  const handleSourceChange = event => {
    setReason(event.target.value)
  }
  return (
    <Fragment>
      <Nav navName="Showroom Form" menuButton="back" backTo="/show_room" />

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
              ref={register({ required: true })}
              name="name"
              defaultValue=""
            />
          </div>
          {errors.name && <p className="text-danger">The name is required</p>}
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
              name="phoneNumber"
              defaultValue=""
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
            />
          </div>
          <div className="form-group">
            <TextField
            id="source"
            select
            label="How did You Learn About Nkwashi"
            name="source"
            value={selectedSource}
            onChange={handleSourceChange}
            className={`${css(styles.selectInput)}`}
          >
            {infoSource.map(source => (
              <MenuItem key={source} value={source}>
                {source}
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
        <Footer position={"5vh"} />
      </div>
    </Fragment>
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
    // marginBottom: 40,
    // marginTop: 50,
    color: "#818188",
    margin: 40
  }
});
