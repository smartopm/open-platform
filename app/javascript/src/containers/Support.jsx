import React, { Fragment } from 'react'
import Nav from '../components/Nav'

export default function Support() {
  return (
    <Fragment>
      <Nav navName="Support" menuButton="back" />
      <br />
      <br />
      <br />
      <div className="justify-content-center align-items-center">
        <p className="text-center">
          Please email{' '}
          <a href="mailto:support@doublegdp.com">support@doublegdp.com</a> for
          anything you need
        </p>
      </div>
    </Fragment>
  )
}
