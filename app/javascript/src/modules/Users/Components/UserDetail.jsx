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

export default function UserDetail({ user }) {
  const classes = useStyles();
  const history = useHistory();
  const matches = useMediaQuery('(max-width:600px)')
  const [open, setOpen] = useState(false)
  return (
    <Grid container>
      <Grid item xs={12} style={matches ? {padding: '0 20px'} : {padding: '0 79px'}}>
        <Paper className={classes.paper} elevation={0}>
          <div style={{display: 'flex'}}>
            <div>
              <Typography color="textPrimary" className={classes.name} data-testid='name'>
                Hello 
                {' '}
                {user?.name}
                ,
              </Typography>
              <div style={{display: 'flex'}}>
                <Typography color="textPrimary" className={classes.more}>
                  More details
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
                <Grid container className={classes.option}>
                  <div style={matches ? {marginRight: '2px'} : {marginRight: '30px'}}>
                    <PersonIcon style={{heigth: '5.6px', width: '13.6px', verticalAlign: 'middle', display: 'flex', marginRight: '14px'}} />
                    <Typography data-testid='user-type'>
                      {user?.userType}
                    </Typography>
                  </div>
                  {user?.phoneNumber && (
                    <div style={matches ? {marginRight: '15px'} : {marginRight: '30px'}}>
                      <PhoneIcon style={{heigth: '5.6px', width: '13.6px', verticalAlign: 'middle', marginRight: '14px'}} />
                      <Typography data-testid='phone'>
                        {user.phoneNumber}
                      </Typography>
                    </div>
                  )}
                  {user?.email && (
                    <div>
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
  }
}));

UserDetail.propTypes = {
  user: PropTypes.shape({ 
    name: PropTypes.string, 
    userType: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
  }).isRequired
};