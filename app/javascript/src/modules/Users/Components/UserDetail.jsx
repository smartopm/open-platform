/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import { useHistory } from 'react-router-dom';
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
        <Paper className={classes.paper}>
          <div style={{display: 'flex'}}>
            <div>
              <Typography color="textPrimary" variant={matches ? 'body2' : 'h6'} style={{fontWeight: 'bold'}} data-testid='name' gutterBottom>
                {t('common:misc.hello')}
                {' '}
                {user?.name}
                ,
              </Typography>
              <div style={{display: 'flex'}}>
                <Typography color="textPrimary" variant='caption' gutterBottom>
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
                <Grid container alignItems="center" className={classes.root}>
                  <div style={matches ? {marginRight: '2px'} : {marginRight: '30px'}}>
                    <PersonIcon style={{heigth: '15px', width: '15px', verticalAlign: 'middle', marginRight: '5px'}} />
                    <Typography color="textPrimary" variant='caption' data-testid='user-type'>
                      {t(`common:user_types.${user?.userType}`)}
                    </Typography>
                  </div>
                  {user?.phoneNumber && (
                    <div style={matches ? {marginRight: '15px'} : {marginRight: '30px'}}>
                      <PhoneIcon style={{heigth: '15px', width: '15px', verticalAlign: 'middle', marginRight: '5px'}} />
                      <Typography color="textPrimary" variant='caption' data-testid='phone'>
                        {user.phoneNumber}
                      </Typography>
                    </div>
                  )}
                  {user?.email && (
                    <div>
                      <EmailIcon style={{heigth: '15px', width: '15px', verticalAlign: 'middle', marginRight: '5px'}} />
                      <Typography color="textPrimary" variant='caption' data-testid='email'>
                        {user.email}
                      </Typography>
                    </div>
                  )}
                </Grid>
              </Collapse>
            </div>
            <div
              style={{marginLeft: 'auto', padding: '10px 10px 10px 15px', backgroundColor: '#FFFFFF', cursor: 'pointer'}}
              className='qrcode'
              onClick={() => history.push(`/id/${user.id}`)}
            >
              <QRCode
                style={{ width: 66 }}
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
    padding: '25px',
    width: '99%',
    backgroundColor: '#F9F9F9',
    marginTop: '30px',
    borderRadius: '23px',
    height: '150px'
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