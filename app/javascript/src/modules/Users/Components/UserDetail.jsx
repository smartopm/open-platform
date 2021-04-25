import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
// import PropTypes from 'prop-types';
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
  const matches = useMediaQuery('(max-width:600px)')
  const [open, setOpen] = useState(false)
  return (
    <Grid container>
      <Grid item xs={12} style={matches ? {padding: '0 20px'} : {padding: '0 79px'}}>
        <Paper className={classes.paper}>
          <div style={{display: 'flex'}}>
            <div>
              <Typography color="textPrimary" variant='h6' style={{fontWeight: 'bold'}} gutterBottom>
                Hello 
                {' '}
                {user?.name}
                ,
              </Typography>
              <div style={{display: 'flex'}}>
                <Typography color="textPrimary" variant='caption' gutterBottom>
                  More details
                </Typography>
                {open ? (<KeyboardArrowDownIcon onClick={() => setOpen(!open)} />) : (
                  <KeyboardArrowRightIcon onClick={() => setOpen(!open)} />
                )}
                
              </div>
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
              >
                <div style={{display: 'flex'}}>
                  <div className={classes.more}>
                    <PersonIcon style={{heigth: '15px', width: '15px'}} />
                    <Typography color="textPrimary" variant='caption' style={{}}>
                      {user.userType}
                    </Typography>
                  </div>
                  {user?.phoneNumber && (
                    <div className={classes.more}>
                      <PhoneIcon style={{heigth: '15px', width: '15px'}} />
                      <Typography color="textPrimary" variant='caption'>
                        {user.phoneNumber}
                      </Typography>
                    </div>
                  )}
                  {user?.email && (
                    <div>
                      <EmailIcon style={{heigth: '15px', width: '15px'}} />
                      <Typography color="textPrimary" variant='caption'>
                        {user.email}
                      </Typography>
                    </div>
                  )}
                </div>
              </Collapse>
            </div>
            <div style={{marginLeft: 'auto', padding: '10px 10px 10px 15px', backgroundColor: '#FFFFFF'}} className='qrcode'>
              <QRCode
                style={{ width: 66 }}
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
    marginTop: '10px',
    borderRadius: '23px',
    height: '150px'
  },
  more: {
    marginRight: '30px'
  }
}));