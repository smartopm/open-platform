/* eslint-disable */
import React from 'react'
import Nav from '../components/Nav'
import Forms from '../components/Forms/FormList'

export default function CommunityForms() {
  return (
    <div>
      <Nav navName="Permits and Request Forms" menuButton="back" backTo="/" />
      <Forms />
    </div>
  )
}
