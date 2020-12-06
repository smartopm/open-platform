import React, { useContext } from 'react'
import CommunitySettingsPage from '../../components/Community/CommunitySettings'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'

export default function CommunitySettings(){
  const authState = useContext(AuthStateContext)   
  return (
    <>
      <Nav
        navName="Community Settings"
        menuButton="back"
        backTo='/'
      />
      <div className="container">
        <CommunitySettingsPage data={authState.user.community} /> 
      </div>
    </>
  )
}