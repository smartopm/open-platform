import React, { Fragment, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Button, Grid } from '@material-ui/core'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import PhoneIcon from '@material-ui/icons/Phone'
import { StyleSheet, css } from 'aphrodite'
import { useHistory } from 'react-router-dom'
import { Context as AuthStateContext } from '../containers/Provider/AuthStateProvider'

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },

  title: {
    fontSize: 14
  },
  pos: {
    margin: 10
  }
})

export default function SupportCard({ handleSendMessage, userData }) {
  const authState = useContext(AuthStateContext)

  const classes = useStyles()
  // hard coding CSM number
  // TODO: @olivier ==> Find a better to get numbers && ids for CSM dynamically
  const CSMNumber = '260974624243'
  let history = useHistory()
  return (
    <Fragment>
      <div className="justify-content-center align-items-center container">
        <Typography paragraph variant="body1" color="textSecondary">
          Nkwashi partners with DoubleGDP on this mobile app to better connect
          with clients and residents, and to deliver efficient and responsive
          public services. Today we have digital IDs to make gate access faster,
          easier, and more secure than paper logs. We also have registration
          kiosk at the showroom and support desk functionality to ensure your
          queries are answered to your satisfaction.
        </Typography>

        <Typography
          variant="body1"
          color="textSecondary"
          component="p"
          align="center"
        >
          We love receiving questions and feedback. You can contact us through
          any of the following channels:
        </Typography>
      </div>
      <div className="justify-content-center align-items-center container">
        <Grid container direction="row" className={classes.root}>
          <Grid item>
            <MailOutlineIcon />
          </Grid>

          <Grid item>
            <Typography
              className={classes.pos}
              color="textSecondary"
              gutterBottom
            >
              <a href="mailto:support@doublegdp.com">support@doublegdp.com</a>
            </Typography>
          </Grid>
        </Grid>

        <Grid container direction="row" className={classes.root}>
          <Grid item>
            <PhoneIcon />
          </Grid>

          <Grid item>
            <Typography className={classes.pos} color="textSecondary">
              <a href="tel:+260976261199">+260 976 261199</a>
            </Typography>
          </Grid>
        </Grid>

        <Grid container direction="row" className={classes.root}>
          <Grid item>
            <PhoneIcon />
          </Grid>

          <Grid item>
            <Typography className={classes.pos} color="textSecondary">
              <a href={`tel:+${CSMNumber}`}>+260 974 624243</a>
            </Typography>
          </Grid>
        </Grid>

        <Grid container direction="row" className={classes.root}>
          <Grid item>
            <WhatsAppIcon />
          </Grid>

          <Grid item>
            <Typography className={classes.pos} color="textSecondary">
              <a href={`https://api.whatsapp.com/send?phone=${CSMNumber}`}>
                {' '}
                +260 974 624243
              </a>
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.root}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            className={css(styles.chatButton)}
          >
            Support Chat
          </Button>
        </Grid>

        <Grid container direction="row" className={classes.root}>
          <Button
            data-testid="crf"
            variant="contained"
            color="primary"
            onClick={() =>
              window.open(
                `https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=${userData.name.replace(
                  /\s+/g,
                  '+'
                )}&${userData.phoneNumber}?entry.1055458143=${
                  userData.phoneNumber
                }:entry.1055458143=""`,
                '_blank'
              )
            }
            className={`${css(styles.chatButton)}`}
          >
            Client Request Form
          </Button>
        </Grid>

        <Grid container direction="row" className={classes.root}>
          <Button
            data-testid="pwmm"
            variant="contained"
            color="primary"
            onClick={() => history.push('/mobile_money')}
            className={`${css(styles.chatButton)}`}
          >
            Pay With Mobile Money
          </Button>
        </Grid>
        {Boolean(authState.user.userType !== 'custodian') && (
          <Grid container direction="row" className={classes.root}>
            <Button
              data-testid="pwmm"
              variant="contained"
              color="primary"
              onClick={() => history.push('/feedback')}
              className={`${css(styles.chatButton)}`}
            >
              Feedback
            </Button>
          </Grid>
        )}
        {!['security_guard', 'resident', 'custodian'].includes(
          authState.user.userType.toLowerCase()
        ) ? (
          <Grid container direction="row" className={classes.root}>
            <Button
              data-testid="pwmm"
              variant="contained"
              color="primary"
              onClick={() => history.push('/map')}
              className={`${css(styles.chatButton)}`}
            >
              Explore
            </Button>
          </Grid>
        ) : null}
      </div>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  chatButton: {
    backgroundColor: '#25c0b0',
    color: '#FFF',
    width: '55%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50
  }
})
