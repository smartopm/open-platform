import React, { Fragment, useState, useEffect } from "react";
import { useQuery, useMutation } from "react-apollo";
import Nav from "../../components/Nav";
import { TextField, MenuItem, Button } from "@material-ui/core";

import { EntryRequestQuery } from "../../graphql/queries.js";
import {
  EntryRequestUpdate,
  EntryRequestGrant,
  EntryRequestDeny,
  CreateUserMutation
} from "../../graphql/mutations.js";
import Loading from "../../components/Loading";
import { StyleSheet, css } from "aphrodite";
import DateUtil, { isTimeValid, getWeekDay } from "../../utils/dateutil";
import { ponisoNumber } from "../../utils/constants.js"
import { ModalDialog } from '../../components/Dialog'
import CaptureTemp from "../../components/CaptureTemp";

// TODO: Check the time of the day and day of the week.

export default function RequestUpdate({ match, history, location }) {
  const previousRoute = location.state && location.state.from
  const isFromLogs = previousRoute === "logs" || false;

  const { loading, data } = useQuery(EntryRequestQuery, {
    variables: { id: match.params.id }
  });
  const [updateEntryRequest] = useMutation(EntryRequestUpdate);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [denyEntry] = useMutation(EntryRequestDeny);
  const [createUser] = useMutation(CreateUserMutation)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isModalOpen, setModal] = useState(false)
  const [modalAction, setModalAction] = useState('grant')
  const [date, setDate] = useState(new Date());
  const [isClicked, setIsClicked] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    nrc: "",
    vehiclePlate: "",
    reason: "",
    loaded: false
  });


  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }


  if (loading) {
    return <Loading />;
  }

  // Data is loaded, so set the initialState, but only once
  if (!formData.loaded && data) {
    setFormData({ ...data.result, loaded: true });
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleUpdateRecord() {
    return updateEntryRequest({ variables: formData });
  }

  function handleGrantRequest() {
    setLoading(true)
    handleUpdateRecord()
      .then(grantEntry({ variables: { id: match.params.id } }))
      .then(() => {
        history.push("/entry_logs", { tab: 1 });
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setMessage(error.message)
      });
  }

  function handleDenyRequest() {
    setIsClicked(!isClicked)
    setLoading(true)
    handleUpdateRecord()
      .then(denyEntry({ variables: { id: match.params.id } }))
      .then(() => {
        history.push("/entry_logs", { tab: 1 });
        setLoading(false)
      });

  }

  function handleEnrollUser() {
    setLoading(true)
    createUser({
      variables: {
        name: formData.name,
        state: 'pending',
        userType: 'client',
        reason: formData.reason,
        phoneNumber: formData.phoneNumber,
        nrc: formData.nrc,
        vehicle: formData.vehiclePlate
      }
    })
      .then(({ data }) => {
        setLoading(false)
        setMessage('User was successfully enrolled')
        history.push(`/user/${data.result.user.id}`)
      })
      .catch(err => {
        setLoading(false)
        console.log(err.message)
        setMessage(err.message)
      })
  }
  function handleModal(_event, type) {
    if (type === 'grant') {
      setModalAction('grant')
    } else {
      setModalAction('deny')
    }
    setModal(!isModalOpen)
    !isModalOpen ? setIsClicked(!isClicked) : setIsClicked(isClicked)
  }



  return (
    <Fragment>
      <Nav
        // navname should be enroll user if coming from entry_logs
        navName={previousRoute === "logs" ? "Request Access" : previousRoute === "enroll" ? "Enroll User" : "Approve Request"}
        menuButton="cancel"
        backTo="/entry_request"
      />

      <ModalDialog
        handleClose={handleModal}
        handleConfirm={handleGrantRequest}
        open={isModalOpen}
        action={modalAction}
        name={formData.name}
      >
        {
          (modalAction === 'grant' && !isTimeValid(date)) && (
            <div>
              <p>Today is {`${getWeekDay(date)} ${DateUtil.dateToString(date)}`} at <b> {DateUtil.dateTimeToString(date)} </b></p>
              <p>
                The current time is outside of normal visiting hours. Are you sure you wish proceed?
              </p>
            </div>
          )
        }
      </ModalDialog>

      <div className="container">
        <form>
          {isFromLogs && (
            <div className="form-group">
              <label className="bmd-label-static" htmlFor="date">
                Date and time submitted
              </label>
              <input
                className="form-control"
                type="text"
                value={
                  formData.guard
                    ? `${new Date(
                      formData.createdAt
                    ).toDateString()} at ${DateUtil.dateTimeToString(
                      new Date(formData.createdAt)
                    )}`
                    : ""
                }
                disabled={true}
                name="date"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              Guard
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.guard ? formData.guard.name : ""}
              disabled={true}
              name="name"
              required
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              NAME
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
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
              value={formData.nrc || ""}
              onChange={handleInputChange}
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
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              value={formData.vehiclePlate || ""}
              name="vehiclePlate"
            />
          </div>
          <div className="form-group">
            <TextField
              id="reason"
              select
              label="Reason for visit"
              name="reason"
              value={formData.reason || ""}
              onChange={handleInputChange}
              className={`${css(styles.selectInput)}`}
            >
              <MenuItem value={formData.reason}>{formData.reason}</MenuItem>
            </TextField>
          </div>

          <br />
          {/* {Temproal component for temperature} */}
          <CaptureTemp refId={match.params.id} refName={formData.name} refType="EntryRequest" />
          
          <br />
          <br />
          {previousRoute === 'enroll' ?

            (
              <Fragment>
                <div className="row justify-content-center align-items-center">
                  <Button
                    variant="contained"
                    onClick={handleEnrollUser}
                    className={`btn ${css(styles.grantButton)}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enrolling ...' : ' Enroll User'}
                  </Button>

                </div>
                <div className='row justify-content-center align-items-center'>
                  <br />
                  <br />
                  {
                    !isLoading && message.length ? <span >{message}</span> : <span />
                  }
                </div>
              </Fragment>
            )
            : !/logs|enroll/.test(previousRoute)
              ? (
                <div className="row justify-content-center align-items-center">
                
                  <div className="col">
                    
                    <Button
                      variant="contained"
                      onClick={(event => handleModal(event, 'grant'))}
                      className={`btn ${css(styles.grantButton)}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Granting ...' : 'Grant'}
                    </Button>
                  </div>
                  <div className="col">
                    <Button
                      variant="contained"
                      onClick={handleDenyRequest}
                      className={`btn  ${css(styles.denyButton)}`}
                      disabled={isLoading}
                    >
                      Deny
                    </Button>

                  </div>
                  <div className="col">
                    <a
                      href={`tel:${ponisoNumber}`}
                      className={` ${css(styles.callButton)}`}
                    >
                      Call Poniso
                    </a>

                  </div>
                </div>
              ) : <span />}
        </form>
      </div>
    </Fragment>
  );
}



const styles = StyleSheet.create({
  logButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    width: "75%",
    boxShadow: "none"
  },
  selectInput: {
    width: "100%"
  },
  grantButton: {
    backgroundColor: "#25c0b0",
    color: "#FFF",
    marginRight: 60,
    // width: "35%"
  },
  denyButton: {
    // backgroundColor: "rgb(230, 63, 69)",
    backgroundColor: "rgb(38, 38, 38)",
    color: "#FFF",
    // width: "35%"
  },
  callButton: {
    color: "rgb(230, 63, 69)",
    textTransform: "unset",
    textDecoration: "none"
  }
});
