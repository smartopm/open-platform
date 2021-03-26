import React, { useContext } from 'react'
import Forms from '../../components/Forms/FormList'
import { Context } from '../Provider/AuthStateProvider'

export default function CommunityForms() {
  const authState = useContext(Context)
  return (
    <>
      <Forms userType={authState?.user?.userType} community={authState.user?.community.name} />
    </>
  )
}
