import React, { useContext } from 'react'
import { Context } from '../../../containers/Provider/AuthStateProvider'
import Forms from '../components/FormList'

export default function CommunityForms() {
  const authState = useContext(Context)
  return (
    <>
      <Forms userType={authState?.user?.userType} community={authState.user?.community.name} />
    </>
  )
}
