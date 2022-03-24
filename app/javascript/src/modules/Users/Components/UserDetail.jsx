/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import { useHistory } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import { QRCode } from 'react-qr-svg'
import { useTranslation } from 'react-i18next';

export default function UserDetail({ user }) {
  const classes = useStyles();
  const history = useHistory();
  const matches = useMediaQuery('(max-width:600px)')
  const { t } = useTranslation('dashboard')
  const [open, setOpen] = useState(false)
  return (
    <Grid container>
      <Grid item xs={12} style={matches ? {padding: '0 20px'} : {padding: '0 79px'}}>
        <Paper className={matches ? classes.paperMobile : classes.paper} elevation={0}>
          <div style={{display: 'flex'}}>
            <div>
              <Typography color="textPrimary" className={matches ? classes.nameMobile : classes.name} data-testid='name'>
                {t('common:misc.hello')}
                {' '}
                {user?.name}
                ,
              </Typography>
              <div style={{display: 'flex'}}>
                <Typography color="textPrimary" className={matches ? classes.moreMobile : classes.more}>
                  {t('common:misc.more_details')}
                </Typography>
                {open ? (<KeyboardArrowDownIcon style={{verticalAlign: 'middle', paddingBottom: '3px'}} onClick={() => setOpen(!open)} />) : (
                  <KeyboardArrowRightIcon style={{verticalAlign: 'middle', paddingBottom: '3px'}} onClick={() => setOpen(!open)} data-testid='collapse' />
                )}
              </div>
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
              >
                <Grid container className={matches? classes.optionMobile : classes.option}>
                  <div style={matches ? {marginRight: '2px'} : {marginRight: '20px'}} className={classes.optionCollapse}>
                    <PersonIcon style={{heigth: '5.6px', width: '13.6px', verticalAlign: 'middle', display: 'flex', marginRight: '14px'}} />
                    <Typography data-testid='user-type'>
                      {t(`common:user_types.${user?.userType}`)}
                    </Typography>
                  </div>
                  {!matches && user?.phoneNumber && (
                    <Divider orientation="vertical" flexItem style={{height: '8px', marginTop: '8px'}} />
                  )}
                  {user?.phoneNumber && (
                    <div style={matches ? {marginRight: '15px'} : {marginRight: '20px', marginLeft: '20px'}} className={classes.optionCollapse}>
                      <PhoneIcon style={{heigth: '5.6px', width: '13.6px', verticalAlign: 'middle', marginRight: '14px'}} />
                      <Typography data-testid='phone'>
                        {user.phoneNumber}
                      </Typography>
                    </div>
                  )}
                  {!matches && user?.email && (
                    <Divider orientation="vertical" flexItem style={{height: '8px', marginTop: '8px'}} />
                  )}
                  {user?.email && (
                    <div className={classes.optionCollapse} style={!matches ? {marginLeft: '20px'} : null}>
                      <EmailIcon style={{heigth: '5.6px', width: '13.6px', verticalAlign: 'middle', marginRight: '14px'}} />
                      <Typography data-testid='email'>
                        {user.email}
                      </Typography>
                    </div>
                  )}
                </Grid>
              </Collapse>
            </div>
            <div 
              style={matches ? {padding: '8px 5px 5px 13px', marginLeft: 'auto'} : {marginLeft: 'auto', padding: '10px 10px 10px 15px', backgroundColor: '#FFFFFF', cursor: 'pointer'}} 
              className={matches ? 'qrcodem' : 'qrcode'}
              onClick={() => history.push(`/id/${user.id}`)}
            >
              <QRCode
                style={matches ? {width: 36, height: 33} : { width: 66 }}
                value={user.id}
              />
            </div>
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles(() => ({
  paper: {
    padding: '40px',
    width: '99%',
    backgroundColor: '#F9F9F9',
    marginTop: '30px',
    borderRadius: '23px',
    height: '200px'
  },
  name: {
    fontWeight: 500,
    fontSize: '28px',
    color: '#141414',
    marginBottom: '15px'
  },
  more: {
    fontWeight: 600,
    fontSize: '16px',
    color: '#585858',
    marginBottom: '24px'
  },
  option: {
    fontWeight: 400,
    fontSize: '14px',
    color: '#141414'
  },
  optionCollapse: {
    display: 'flex'
  },
  nameMobile: {
    fontSize: '18px',
    fontWeight: 500,
    color: '#141414',
    marginBottom: '7px'
  },
  paperMobile: {
    padding: '0px',
    background: '#FFFFFF',
    marginTop: '20px',
    marginRight: '10px'
  },
  moreMobile: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#585858',
    marginBottom: '12px'
  },
  optionMobile: {
    flexDirection: 'column'
  }
}));

UserDetail.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    userType: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};