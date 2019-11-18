import React, { Fragment, useState, useEffect, useRef } from "react";
import { useMutation } from "react-apollo";
import { StyleSheet, css } from "aphrodite";
import { Button, TextField, MenuItem } from "@material-ui/core";
import SignaturePad from "react-signature-canvas";
import { entryReason } from "../utils/constants";
import { EntryRequestCreate } from "../graphql/mutations.js";
import Nav from "../components/Nav";
import { ReasonInputModal } from "../components/Dialog";

export default function LogEntry({ history }) {
  const name = useFormInput("");
  const nrc = useFormInput("");
  const phoneNumber = useFormInput("");
  const vehicle = useFormInput("");
  const business = useFormInput("");
  const reason = useFormInput("");
  const [createEntryRequest] = useMutation(EntryRequestCreate);
  const [isbtnClicked, setBtnClicked] = useState(false);
  const [isModalOpen, setModal] = useState(false);
  const signRef = useRef(null);

  function handleSubmit() {
    setBtnClicked(!isbtnClicked);
    const userData = {
      name: capitalizeLastName(name.value),
      vehiclePlate: vehicle.value,
      phoneNumber: phoneNumber.value,
      nrc: nrc.value,
      reason: business.value === "Other" ? reason.value : business.value
    };
    createEntryRequest({ variables: userData }).then(({ data }) => {
      // Send them to the wait page
      history.push(`/request_wait/${data.result.entryRequest.id}`);
    });
  }

  useEffect(() => {
    if (business.value === "Other") {
      setModal(!isModalOpen);
    }
  }, [business.value]);
  return (
    <Fragment>
      <ReasonInputModal
        handleClose={() => setModal(!isModalOpen)}
        open={isModalOpen}
      >
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            {...reason}
            name="reason"
            placeholder="Other"
            required
          />
        </div>
      </ReasonInputModal>
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

          <div className={css(styles.signatureContainer)}>
            <SignaturePad
              canvasProps={{ className: css(styles.signaturePad) }}
              ref={signRef}
            />
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
              disabled={isbtnClicked}
            >
              {isbtnClicked ? "Submitting ..." : " Request Entry"}
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
function capitalizeLastName(fullName) {
  const names = fullName.trim().split(" ");
  if (!names.length) {
    return;
  }
  return names
    .map((name, index) => (index === 1 ? name.toUpperCase() : name))
    .join(" ");
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
  },
  signatureContainer: {
    width: "100%",
    height: "80%",
    margin: "0 auto",
    backgroundColor: "#FFFFFF"
  },
  signaturePad: {
    width: "100%",
    height: "100%"
  }
});
