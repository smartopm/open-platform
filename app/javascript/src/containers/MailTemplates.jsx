import React from 'react'
import Nav from '../components/Nav'
import MailTemplateList from '../components/EmailTemplate/MailTemplateList'

export default function MailTemplates() {
  return (
    <>
      <Nav navName="Mail Templates" menuButton="back" backTo="/" />
      <MailTemplateList />
    </>
  )
}
