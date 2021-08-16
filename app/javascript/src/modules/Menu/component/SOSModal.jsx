
import React, { useCallback, useState } from 'react';
import { useMutation } from 'react-apollo'
import { useTranslation } from 'react-i18next'; 
// eslint-disable-next-line import/no-unresolved
import { useLongPress } from 'use-long-press';
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";
import Button from '@material-ui/core/Button';
import PersonPinIcon from "@material-ui/icons/PersonPin";
import EditIcon from "@material-ui/icons/Edit";
import PanicButtonSVG from './PanicButtonSVG';
import FeedbackButtonSVG from './FeedbackButtonSVG';
import MessageAlert from '../../../components/MessageAlert';
import { formatError } from '../../../utils/helpers';
import {CommunityEmergencyMutation} from '../graphql/sos_mutation';
import userProps from '../../../shared/types/user';

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
      marginTop: "1px",
    },
   
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      marginTop: "2px"
    }

  },


  header:{
    fontWeight: "bold",
    fontSize: "17px",
    '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
    },
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
    marginTop: "8rem",
    fontSize: "1rem",
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      marginTop: "2rem"
    }
   
},

  
  CloseIcon: {
    color: "#fff",
    display: 'flex',
    justifyContent: "space-between",
    marginTop: "2rem",
    '@media (min-device-width: 414px) and (max-device-height: 736px)' : {
      marginTop: "4rem",
    },
    '@media (min-device-width: 375px) and (max-device-height: 667px)' : {
      marginTop: "5rem",
    },
    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      marginTop: "9rem"
    } ,
    '@media  (min-device-width: 360px) and (max-device-height: 640px)' : {
      marginTop: "6rem"
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
    justifyContent: "center"
  }
}));


const SOSModal=({open, setOpen, authState})=> {

  const [panicButtonMessage, setPanicButtonMessage] = useState({ isError: false, detail: '' });
  const [panicAlertOpen, setPanicAlertOpen] = useState(false);
  const [panicButtonPressed, setPanicButtonPressed] = useState(false);
  const [communityEmergency] = useMutation(CommunityEmergencyMutation)

  const communityHasEmergencyNumber = Boolean(authState.user?.community.emergencyCallNumber)

  const { t } = useTranslation('panic_alerts')
  // eslint-disable-next-line no-unused-vars
  const callback = useCallback(_event => {

    communityEmergency().then(()=>{
      setPanicButtonPressed(true)
      setPanicButtonMessage({
        isError: false,
        detail: t('panic_alerts.panic_success_alert')
      });
      setPanicAlertOpen(true);
    })
    .catch(error => {
      setPanicButtonMessage({ isError: true, detail: formatError(error.message) });
      setPanicAlertOpen(true);
    })
  },[t, communityEmergency ]);

  const showPanicAlert = ()=> {
    setPanicButtonMessage({ isError: true, detail: t('panic_alerts.panic_error_alert') });
    setPanicAlertOpen(true);

  }

  const resetSOSModalState = ()=>{
    setOpen(false)
    setPanicButtonPressed(false)
    setPanicButtonMessage({ isError: false, detail: '' })
    setPanicAlertOpen(false);
  }

  const bind = useLongPress(callback, {
    // eslint-disable-next-line no-unused-vars
    onCancel: _event => showPanicAlert(),
    threshold: 3000,
    captureEvent: true,
    cancelOnMovement: true,
    detect: 'both',
  });
  
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
          <CloseIcon onClick={resetSOSModalState} />
          {communityHasEmergencyNumber ? (
            <p>
              <a href={`tel: ${authState.user?.community.emergencyCallNumber}`}>
                {t('panic_alerts.click_to_call')} 
                {' '}
                {authState.user?.community.emergencyCallNumber}
              </a>
            </p>
) : null}
        </div>
        <MessageAlert
          type={panicButtonMessage.isError ? 'error' : 'success'}
          message={panicButtonMessage.detail}
          open={panicAlertOpen}
          handleClose={() => setPanicAlertOpen(false)}
        />
        <br />
        { !panicButtonPressed ? (
          <div data-testid="modal-data">
            <div>


              <div className={classes.contents}>
                <div>
                  <PanicButtonSVG bind={bind} />
                </div>

                <br />

                <h4 className={classes.header}>{t('panic_alerts.header')}</h4>
                <p className={classes.info}>
                  {t('panic_alerts.info')}
                </p>
              </div>

              <div className={classes.location}>
                <div className={classes.locationPin}>
                  <PersonPinIcon fontSize="large" />
                </div>

                <div className={classes.locationContent}>
                  <p className={classes.curentLocation}>
                    {" "}
                    <small>{t('panic_alerts.user_location_heeader')}</small>
                    <br />
                    {t('panic_alerts.user_location')}
                  </p>
                </div>

                <div className={classes.locationEditIcon}>
                  <EditIcon />
                </div>
              </div>

              <p className={classes.disclaimer}>
                {t('panic_alerts.sos_disclaimer')}
              </p>
            </div>
          </div>
):(
  <div>
    <div className={classes.feedbackContents}>
      <div>
        <FeedbackButtonSVG />
      </div>

      <br />
      <p className={classes.feedbackInfo}>
        {t('panic_alerts.sos_feedback')}
      </p>

      <Button variant="outlined" color="primary" className={classes.iamSafeButton} data-testid="sos-modal-iam-safe-button">
        {t('panic_alerts.am_safe')}
      </Button>
    </div>

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
    }).isRequired
  }


export default SOSModal;