import React, { Fragment } from 'react'
import Nav from '../components/Nav'

export default function Support() {
  return (
    <Fragment>
      <Nav navName="Support" menuButton="back" />
      <br />
      <br />
      <br />
      <div className="justify-content-center align-items-left">
        <h3 className="text-center"> Please reach us on</h3>
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
