import React, { Fragment, useState } from "react";
import { useMutation } from "react-apollo";
import { StyleSheet, css } from "aphrodite";
import { Button, TextField, MenuItem } from "@material-ui/core";
import { entryReason } from "../utils/constants";
import { EntryRequestCreate } from "../graphql/mutations.js";
import Nav from "../components/Nav";

export default function LogEntry({ history }) {
  const name = useFormInput("");
  const nrc = useFormInput("");
  const phoneNumber = useFormInput("");
  const vehicle = useFormInput("");
  const business = useFormInput("");
  const [createEntryRequest] = useMutation(EntryRequestCreate);

  //   we need to create a user and then use their id to log entry
  function handleSubmit() {
    const userData = {
      name: name.value,
      vehiclePlate: vehicle.value,
      phoneNumber: phoneNumber.value,
      nrc: nrc.value,
      reason: business.value
    };

    createEntryRequest({ variables: userData }).then(({ data }) => {

      // Send them to the wait page
      history.push(`/request_wait/${data.result.entryRequest.id}`);
    });
  }
  return (
    <Fragment>
      <Nav navName="New Log" menuButton="cancel" />
      <div className="container">
        <form>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              NAME
            </label>
            <input
              className="form-control"
              type="text"
              {...name}
              name="_name"
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
              {...nrc}
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
              {...phoneNumber}
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
              {...vehicle}
              name="vehicle"
            />
          </div>
          <div className="form-group">
            <TextField
              id="reason"
              select
              label="Reason for visit"
              name="reason"
              {...business}
              className={`${css(styles.selectInput)}`}
            >
              {entryReason.map(reason => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div
            className={`row justify-content-center align-items-center ${css(
              styles.linksSection
            )}`}
          >
            <Button
              variant="contained"
              className={`btn ${css(styles.logButton)}`}
              onClick={handleSubmit}
            >
              Request Entry
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
// Todo: refactor the above form to just use one state object
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  const handleChange = event => {
    setValue(event.target.value);
  };
  return { value, onChange: handleChange };
}

const styles = StyleSheet.create({
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
