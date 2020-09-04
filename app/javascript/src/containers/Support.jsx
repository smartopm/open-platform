/* eslint-disable */
import React, { Fragment, useContext } from 'react'
import Nav from '../components/Nav'
import { useHistory } from 'react-router-dom'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'
import SupportCard from '../components/SupportCard'


export default function Support() {
  const history = useHistory()
  const authState = useContext(AuthStateContext)
  // hard coding CSM number
  // TODO: @olivier ==> Find a better to get numbers && ids for CSM dynamically
  const CSMNumber = '260974624243'

  function handleSendMessage() {
    history.push({
      pathname: `/message/${authState.user.id}`,
      state: {
        clientName: 'Contact Support',
        clientNumber: CSMNumber,
        from: 'contact'
      }
    })
  }

  return (
    <Fragment>
      <Nav navName="Contact" menuButton="back" backTo="/" />
      <br />

      <SupportCard handleSendMessage={handleSendMessage} user={authState.user} />
    </Fragment>
  )
}

