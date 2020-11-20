/* eslint-disable */
import React, { useContext } from 'react'
import Nav from '../../components/Nav'
import Forms from '../../components/Forms/FormList'
import { Context } from '../Provider/AuthStateProvider'

export default function CommunityForms() {
  const authState = useContext(Context)
  return (
    <div>
      <Nav navName="Permits and Request Forms" menuButton="back" backTo="/" />
      <Forms userType={authState.user.userType} />
    </div>
  )
}
