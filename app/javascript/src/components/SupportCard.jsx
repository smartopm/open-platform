import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Button, Grid } from '@material-ui/core'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import PhoneIcon from '@material-ui/icons/Phone'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { propAccessor } from '../utils/helpers'

const icons = {
  mail: <MailOutlineIcon />,
  phone: <PhoneIcon />,
  whatsapp: <WhatsAppIcon />
}

const linkType = {
  phone: 'tel',
  mail: 'mailto'
}

export function SupportContact({ classes, support }) {
  const number = support.contact.replace(/\s/g, '')
  const whatsappLink = `https://api.whatsapp.com/send?phone=${number}`
  const link = `${
    support.type === 'whatsapp'
      ? whatsappLink
      : `${linkType[support.type]}:${number}`
  }`

  return (
    <Grid container direction="row" className={classes.root}>
      <Grid item>{icons[support.type]}</Grid>

      <Grid item>
        <Typography className={classes.pos} color="textSecondary">
          <a href={link}>{support.contact}</a>
        </Typography>
      </Grid>
    </Grid>
  )
}

export default function SupportCard({ handleSendMessage, user }) {
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles()
  const history = useHistory()

  function supports() {
    let result = handlePopulateSupports([], [], 'supportNumber', 'phone')
    result = handlePopulateSupports(
      result.sales,
      result.customerCare,
      'supportWhatsapp',
      'whatsapp'
    )
    result = handlePopulateSupports(
      result.sales,
      result.customerCare,
      'supportEmail',
      'mail'
    )

    return {
      sales: result.sales,
      customerCare: result.customerCare
    }
  }

  function handlePopulateSupports(sales, customerCare, supportName, type) {
    let supportType = type
    if (type === 'phone') supportType = 'phone_number'
    if (type === 'mail') supportType = 'email'
    // eslint-disable-next-line no-unused-expressions
    propAccessor(user?.community, supportName)?.forEach(support => {
      if (support.category === 'sales')
        sales.push({
          contact: propAccessor(support, supportType),
          type
        })
      if (support.category === 'customer_care')
        customerCare.push({
          contact: propAccessor(support, supportType),
          type
        })
    })
    return {
      sales,
      customerCare
    }
  }

  return (
    <>
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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              color="textSecondary"
            >
              Sales Support
            </Typography>
            {supports().sales.length ? (
              supports().sales.map(support => (
                <SupportContact
                  key={support.contact}
                  classes={classes}
                  support={support}
                />
              ))
            ) : (
              <Typography
                paragraph
                variant="body1"
                color="textSecondary"
                align="center"
              >
                Contacts not available at the moment
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              color="textSecondary"
            >
              Customer Care
            </Typography>

            {supports().customerCare.length ? (
              supports().customerCare.map(support => (
                <SupportContact
                  key={support.contact}
                  classes={classes}
                  support={support}
                />
              ))
            ) : (
              <Typography
                paragraph
                variant="body1"
                color="textSecondary"
                align="center"
              >
                Contacts not available at the moment
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container direction="row" className={classes.root}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            className={classes.chatButton}
          >
            Support Chat
          </Button>
        </Grid>

        <Grid container direction="row" className={classes.root}>
          <Button
            data-testid="pwmm"
            variant="contained"
            color="primary"
            onClick={() => history.push('/mobile_money')}
            className={classes.chatButton}
          >
            Pay With Mobile Money
          </Button>
        </Grid>
        {Boolean(user?.userType !== 'custodian') && (
          <Grid container direction="row" className={classes.root}>
            <Button
              data-testid="feed"
              variant="contained"
              color="primary"
              onClick={() => history.push('/feedback')}
              className={classes.chatButton}
            >
              Feedback
            </Button>
          </Grid>
        )}
        {!['security_guard', 'custodian'].includes(
          user?.userType.toLowerCase()
        ) ? (
          <Grid container direction="row" className={classes.root}>
            <Button
              data-testid="pwmm"
              variant="contained"
              color="primary"
              onClick={() => history.push('/map')}
              className={classes.chatButton}
            >
              Explore
            </Button>
          </Grid>
        ) : null}
      </div>
    </>
  )
}

SupportContact.propTypes = {
  support: PropTypes.shape({
    contact: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  classes: PropTypes.objectOf(PropTypes.object).isRequired
}
SupportCard.propTypes = {
  user: PropTypes.shape({
    userType: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    community: PropTypes.object
  }).isRequired,
  handleSendMessage: PropTypes.func.isRequired
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatButton: {
    color: '#FFF',
    width: '55%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50
  },
  title: {
    fontSize: 14
  },
  pos: {
    margin: 10
  }
})
