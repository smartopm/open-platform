/* eslint-disable */
import React, { useContext } from 'react'
import Nav from '../components/Nav.jsx'
import MailTemplateList from '../components/EmailTemplate/MailTemplateList'
import { Context as AuthStateContext } from './Provider/AuthStateProvider.js'

export default function MailTemplates() {
  const authState = useContext(AuthStateContext)

  return (
    <>
      <Nav navName="Mail Templates" menuButton="back" backTo="/" />
      <MailTemplateList />
    </>
  )
}
