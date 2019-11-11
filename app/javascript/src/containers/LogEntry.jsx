import React, { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import Nav from "../components/Nav";
import { Button } from "@material-ui/core";
import { useMutation } from "react-apollo";
import { AddActivityLog, CreateUserMutation } from "../graphql/mutations";

export default function LogEntry({ history }) {
  const name = useFormInput("");
  const nrc = useFormInput("");
  const phoneNumber = useFormInput("");
  const vehicle = useFormInput("");
  const business = useFormInput("");

  const [addLogEntry] = useMutation(AddActivityLog);
  const [createUser] = useMutation(CreateUserMutation);

  //   we need to create a user and then use their id to log entry
  function handleSubmit() {
    const userData = {
      name: name.value,
      vehicle: vehicle.value,
      phoneNumber: phoneNumber.value
    };
    // this should be a string
    const note = `NRC: ${nrc.value}, Business: ${business.value}`;

    createUser({
      variables: { ...userData }
    })
      .then(({ data }) => {
        return addLogEntry({
          variables: { userId: data.result.user.id, note }
        });
      })
      .then(() => {
        // clean up
        history.push("/guard_home");
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
            <label className="bmd-label-static" htmlFor="business">
              BUSINESS
            </label>
            <input
              className="form-control"
              type="text"
              {...business}
              name="business"
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
            >
              Log Entry
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
  flag: {
    display: "inline-block",
    marginTop: 7
  },
  countryCode: {
    display: "inline-block",
    marginTop: -2,
    marginLeft: 6
  },

  phoneNumberInput: {
    marginTop: 50
  },
  logButton: {
    backgroundColor: "#53d6a5",
    color: "#FFF",
    width: "75%",
    boxShadow: "none"
  }
});
