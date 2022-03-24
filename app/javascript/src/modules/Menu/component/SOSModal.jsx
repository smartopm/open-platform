
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-apollo'
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import { useLongPress } from 'use-long-press';
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles';
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import PanicButtonSVG from './PanicButtonSVG';
import MessageAlert from '../../../components/MessageAlert';
import { formatError } from '../../../utils/helpers';
import {CommunityEmergencyMutation, CancelCommunityEmergencyMutation} from '../graphql/sos_mutation';
import userProps from '../../../shared/types/user';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 400,
    backgroundColor: "#ff7f7f",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4),
    color: "#FFFFFF",
    position: "fixed",
    marginBottom: "2px",
    height: "90%",
    overflow: "auto",
    userSelect: 'none',
    "-webkit-user-select": " none",
    "-webkit-touch-callout": " none",
    "-ms-user-select": " none",
    "-moz-user-select": "none",
    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      width: 380,
      height: "100%",
    } ,

    '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
      height: "100%"
    },

    '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
      height: "100%",
    },
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      height: "100%",
    }
  },

  contents: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
      marginTop: "1px",
    },

    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      marginTop: "2px"
    }
  },


  feedbackContents: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginTop: "6rem",
    justifyContent: "space-between",
    '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
      marginTop: "6rem"
    },

    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      marginTop: "6rem"
    }

  },


  header:{
    fontWeight: "bold",
    fontSize: "17px",
  },

  callLink:{
    color: '#ffffff'
  },

  digitInSeconds:{
    fontWeight: "bold",
    fontSize: "94px",
    lineHeight: '4.2rem'
  },

  info:{
      fontWeight: "small",
      fontSize: "14px",
      '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
        marginBottom: "2rem"
      },

  },

  feedbackInfo:{
    fontWeight: "small",
    fontSize: "1rem",
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      fontSize: "1.2rem",
    }

},


  CloseIcon: {
    color: "#fff",
    display: 'flex',
    justifyContent: "space-between",
    marginTop: "2rem",
    '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
      marginTop: "1rem",
    },
    '@media (min-device-width: 375px) and (max-device-height: 667px)' : {
      marginTop: "1rem",
    },
    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      marginTop: "1rem"
    } ,
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      marginTop: "2px"
    }
  },


  iamSafeButton: {
    backgroundColor: "#ffffff",
    color: "#1e1e1e",
    borderRadius: "1px",
    margin: "0 auto",
    textTransform: "none",
    width: "8rem"
  },

  location: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "4rem",
    borderBottom: "1px solid #ff9696",
    borderTop: "0.5px solid #ff9696",
    '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
      marginTop: "2rem",
    },
    '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
      marginTop: "1rem"
    },

    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      marginTop: "2px"
    } ,
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      marginTop: "4px"
    }
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
    fontSize: "13px",
    '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
      marginTop: "4rem",
    },
    '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
      marginTop: "2rem",
    },

    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      marginTop: "1px"
    } ,
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      marginTop: "3rem"
    }

  },

  modal: {
    display: "flex",
    alignItems: "center",
    overflow:'scroll',
    justifyContent: "center",
    userSelect: 'none',
    "-webkit-user-select": " none",
    "-webkit-touch-callout": " none",
    "-ms-user-select": " none",
    "-moz-user-select": "none",
  },
}));


const SOSModal=({open, setOpen, location, authState})=> {

  const [panicButtonMessage, setPanicButtonMessage] = useState({ isError: false, detail: '' });
  const [panicAlertOpen, setPanicAlertOpen] = useState(false);
  const [panicButtonPressed, setPanicButtonPressed] = useState(false);
  const [iamSafeButtonPressed, setIamSafeButtonPressed] = useState(false);
  const [counter, setCounter] = useState(-1);
  const [communityEmergency] = useMutation(CommunityEmergencyMutation)
  const [communityEmergencyCancel] = useMutation(CancelCommunityEmergencyMutation)

  const { t } = useTranslation('panic_alerts')

  const callback = () => {
    setPanicButtonPressed(true)
    if (location.loaded && !location.error){
      const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`
      communityEmergency({ variables: { googleMapUrl } }).then(()=>{
        setPanicButtonMessage({
          isError: false,
          detail: t('panic_alerts.panic_success_alert')
        });
        setPanicAlertOpen(true);
      })
      .catch(error => {
        setPanicButtonMessage({ isError: true, detail: formatError(error.message) });
        setPanicAlertOpen(true);
        setPanicButtonPressed(false)
      })

    }
    else{
      communityEmergency({ variables: { googleMapUrl: null } }).then(()=>{
        setPanicButtonMessage({
          isError: false,
          detail: t('panic_alerts.panic_success_alert')
        });
        setPanicAlertOpen(true);
      })
      .catch(error => {
        setPanicButtonMessage({ isError: true, detail: formatError(error.message) });
        setPanicAlertOpen(true);
        setPanicButtonPressed(false)
      })

    }

  };


  const cancelCommunityEmergency = () => {
    setPanicButtonPressed(true)
    communityEmergencyCancel().then(()=>{
        setPanicButtonMessage({
          isError: false,
          detail: t('panic_alerts.cancel_emergency_success_alert')
        });
        setPanicAlertOpen(true);
      })
      .catch(error => {
        setPanicButtonMessage({ isError: true, detail: formatError(error.message) });
        setPanicAlertOpen(true);
        setPanicButtonPressed(false)
      })

  };

  const showPanicAlert = ()=> {
    setPanicButtonMessage({ isError: true, detail: t('panic_alerts.panic_error_alert') });
    setPanicAlertOpen(true);
    setCounter(-1)

  }

  const resetSOSModalState = ()=>{
    setOpen(false)
    setPanicButtonPressed(false)
    setPanicButtonMessage({ isError: false, detail: '' })
    setPanicAlertOpen(false);
    setCounter(-1)
    setIamSafeButtonPressed(false);
  }

  const handleIamSafeButtonClick = () => {
    setIamSafeButtonPressed(true);
    cancelCommunityEmergency()
    setPanicButtonPressed(false)
  }

  const handleLongPressStart = () => {
    setPanicAlertOpen(false);
    setPanicButtonMessage({ isError: false, detail: '' });
    setCounter(0)
  }

  const bind = useLongPress(callback, {
    onCancel: () => showPanicAlert(),
    threshold: 3000,
    captureEvent: true,
    cancelOnMovement: true,
    detect: 'both',
    onStart: () => handleLongPressStart()
  });

  useEffect(() => {
    let timer;
   if(counter >= 0) {
     if(counter < 3) {
      timer = setTimeout(() => { setCounter(counter + 1)}, 1000)
     }
   }

   return function(){
     clearTimeout(timer)
   }
  }, [counter])

  const classes = useStyles();

  return (

    <Modal
      disablePortal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      aria-labelledby="server-modal-title"
      aria-describedby="server-modal-description"
      className={classes.modal}
      data-testid="sos-modal"
    >
      <div className={classes.paper}>
        <div className={classes.CloseIcon}>
          <p>
            <a className={classes.callLink} href={`tel: ${authState.user?.community.emergencyCallNumber}`}>
              {t('panic_alerts.click_to_call')}
              {' '}
              {authState.user?.community.emergencyCallNumber}
            </a>
          </p>
          <CloseIcon onClick={resetSOSModalState} data-testid="sos-modal-close-btn" />
        </div>
        <MessageAlert
          type={panicButtonMessage.isError ? 'error' : 'success'}
          message={panicButtonMessage.detail}
          open={panicAlertOpen}
          handleClose={() => setPanicAlertOpen(false)}
        />
        <br />
        { (!panicButtonPressed && !iamSafeButtonPressed) && (
          <div data-testid="modal-data">
            <div>
              <div className={classes.contents}>
                <h4 className={classes.header}>{t('panic_alerts.sos_disclaimer_header')}</h4>
                <p>
                  {' '}
                  {t('panic_alerts.sos_disclaimer_body')}
                </p>
                <br />
                <br />
                <h4 className={classes.header}>{t('panic_alerts.press_and_hold')}</h4>
                <p>
                  {' '}
                  {t('panic_alerts.for_3_seconds')}
                </p>
                {((counter >= 0 && counter < 3) && !panicButtonMessage.isError)
                  ? <h1 className={classes.digitInSeconds}>{Number(counter + 1)}</h1>
                  : <p className={classes.info}>{t('panic_alerts.info')}</p>
                  }
                <br />
                <div>
                  <PanicButtonSVG bind={bind} t={t} />
                </div>
              </div>
            </div>
          </div>
)}
        {panicButtonPressed && (
        <div className={classes.feedbackContents}>
          <h4 className={classes.header}>{t('panic_alerts.sos_feedback_header')}</h4>
          <p className={classes.feedbackInfo}>
            {t('panic_alerts.sos_feedback_body')}
          </p>

          <Button
            variant="outlined"
            color="primary"
            className={classes.iamSafeButton}
            data-testid="sos-modal-iam-safe-button"
            onClick={handleIamSafeButtonClick}
          >
            {t('panic_alerts.am_safe')}
          </Button>
        </div>
)}

        {iamSafeButtonPressed && !panicButtonMessage.isError && (
        <div className={classes.feedbackContents} data-testid="sos-modal-iam-safe-body">
          <h4 className={classes.header}>{t('panic_alerts.am_safe_feedback_header')}</h4>
          <p className={classes.feedbackInfo}>
            {t('panic_alerts.am_safe_feedback_body')}
          </p>
        </div>
)}
      </div>
    </Modal>

       )

  }

  SOSModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,

    authState: PropTypes.shape({
      user: userProps,
    }).isRequired,
    location: PropTypes.shape({
      loaded: PropTypes.bool,
      error: PropTypes.shape({
        message: PropTypes.string
      }),
      coordinates: PropTypes.shape({
        lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    }).isRequired

  }


export default SOSModal;