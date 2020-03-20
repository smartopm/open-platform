import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'
import Nav from '../components/Nav'

export default function Support() {
  return (
    <Fragment>
      <Nav navName="Contact" menuButton="back" />
      <br />
      <div className="justify-content-center align-items-center container">

        <Typography  paragraph
          variant="body1" color="textSecondary" component="p">
          Nkwashi partners with DoubleGDP on this mobile app to better connect with clients and residents,
          and to deliver efficient and responsive public services. Today we have digital IDs to make gate access faster, easier, and more secure than paper logs. We also have registration kiosk at the showroom and support desk functionality to ensure your queries are answered to your satisfaction.
          </Typography>

          <Typography variant="body1" color="textSecondary" component="p" align="center">
          We love receiving questions and feedback. You can contact us through any of the following channels:
          </Typography>
        <br />
        <p className="text-center">
          Email:{' '}
          <a href="mailto:support@doublegdp.com">support@doublegdp.com</a>
        </p>
        <p className="text-center">
          Tel:{' '}
          <a href="tel:+260976261199">+260 976 261199</a>

          <p className="text-center">
            Cel:{' '}
            <a href="tel:+260974624243">+260 974 624243</a>
          </p>

        </p>
        <p className="text-center">
          WhatsApp:{' '}
          <a href="https://api.whatsapp.com/send?phone=260974624243"> +260 974 624243</a>
        </p>
      </div>
    </Fragment>
  )
}
