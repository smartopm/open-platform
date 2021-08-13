
import React, { useCallback, useState } from 'react';
import { useMutation } from 'react-apollo'
import { useTranslation } from 'react-i18next';
import { useLongPress } from 'use-long-press';
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import EditIcon from "@material-ui/icons/Edit";
import PanicButtonSVG from './PanicButtonSVG';
import MessageAlert from '../../../components/MessageAlert';
import { formatError, propAccessor } from '../../../utils/helpers';
import { CreateNote } from '../../../graphql/mutations';
import {CommunityEmergencyMutation} from '../graphql/sos_mutation';

const useStyles = makeStyles((theme) => ({

  paper: {
    width: 400,
    height: 850,
    backgroundColor: "#ff7f7f",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4),
    marginTop: "5rem",
    marginBottom: "4rem",
    color: "#FFFFFF"

  },

  contents: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },

  header:{
    fontWeight: "bold"
  },

  alarmInfo:{
      fontWeight: "small"
  },

  CloseIcon: {
    color: "#fff",
    display: 'flex',
    justifyContent: "space-between"
  },

  location: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "4rem",
    borderBottom: "1px solid #ff9696",
    borderTop: "0.5px solid #ff9696"
  },

  locationEditIcon: {
    marginLeft: "auto"
  },
  locationPin: {
    marginRight: "1rem"
  },

  locationContent: {
    marginRight: "1rem"
  },

  disclaimer: {
    marginTop: "8rem",
    fontSize: "13px"
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));
const SOSModal=({open, openSOSModal})=> {

  const [panicButtonMessage, setPanicButtonMessage] = useState({ isError: false, detail: '' });
  const [panicAlertOpen, setPanicAlertOpen] = useState(false);
  const [panicButtonPressed, setPanicButtonPressed] = useState(false);
  // const [createTask] = useMutation(CreateNote)
  const [communityEmergency] = useMutation(CommunityEmergencyMutation)

  const { t } = useTranslation('panic_alerts')


  const callback = useCallback(_event => {
    setPanicButtonPressed(true)
  
    communityEmergency().then(()=>{
      setPanicButtonMessage({
        isError: false,
        detail: t('panic_success_alert')
      });
      setPanicAlertOpen(true);
    })
    .catch(error => {
      setPanicButtonMessage({ isError: true, detail: formatError(error.message) });
      setPanicAlertOpen(true);
    })
  }, []);


  const showPanicAlert = ()=> {
    setPanicButtonMessage({ isError: true, detail: t('panic_error_alert') });
    setPanicAlertOpen(true);

  }

  const bind = useLongPress(callback, {
    onCancel: _event => showPanicAlert(),
    threshold: 3000,
    captureEvent: true,
    cancelOnMovement: true,
    detect: 'both',
  });
  
  const classes = useStyles();

  return (
    <div>
      {
        !panicButtonPressed ?(
          <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            open={open}
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            className={classes.modal}
          >
            <div className={classes.paper}>
              <div className={classes.CloseIcon}>
                <CloseIcon onClick={openSOSModal} />
                <p> Call 112</p> 
              </div>
              <MessageAlert
                type={panicButtonMessage.isError ? 'error' : 'success'}
                message={panicButtonMessage.detail}
                open={panicAlertOpen}
                handleClose={() => setPanicAlertOpen(false)}
              />
              <br />

              <div className={classes.contents}>
                <div>
                  <PanicButtonSVG bind={bind} />
                </div>

                <br />

                <h4 className={classes.header}>KEEP CALM!</h4>
                <p className={classes.alarmInfo}>
                  After pressing SOS, notifications will be sent out to our
                  administrators and a member of our security team will speak to
                  you.
                </p>
              </div>

              <div className={classes.location}>
                <div className={classes.locationPin}>
                  <PersonPinIcon fontSize="large" />
                </div>

                <div className={classes.locationContent}>
                  <p className={classes.curentLocation}>
                    {" "}
                    Estimated current location
                    <br />
                    1562 Pablano Street
                  </p>
                </div>

                <div className={classes.locationEditIcon}>
                  <EditIcon />
                </div>
              </div>

              <p className={classes.disclaimer}>
                * Only use this service incase of extreme emergency. Please use
                customer support or incident report form for non-emergencies
              </p>
            </div>
          </Modal>
      ): (
        <div>        
          {' '}
          <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            open={open}
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            className={classes.modal}
          >
            <div className={classes.paper}>
              <div className={classes.CloseIcon}>
                <CloseIcon onClick={openSOSModal} />
                <p> Call 11455</p> 
              </div>
              <MessageAlert
                type={panicButtonMessage.isError ? 'error' : 'success'}
                message={panicButtonMessage.detail}
                open={panicAlertOpen}
                handleClose={() => setPanicAlertOpen(false)}
              />
              <br />

              <div className={classes.contents}>
                <div>
                  <PanicButtonSVG bind={bind} />
                </div>

                <br />

                <p className={classes.alarmInfo}>
                  Please stand by, we are currently requesting for help
                </p>
              </div>

              <div className={classes.location}>
                <div className={classes.locationPin}>
                  <PersonPinIcon fontSize="large" />
                </div>

                <div className={classes.locationContent}>
                  <p className={classes.curentLocation}>
                    {" "}
                    Estimated current location
                    <br />
                    1562 Pablano Street
                  </p>
                </div>

                <div className={classes.locationEditIcon}>
                  <EditIcon />
                </div>
              </div>
            </div>
          </Modal>
        </div>
)
      }

    </div>
  );
}


export default SOSModal;