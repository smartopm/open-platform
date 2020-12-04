import React, { useContext } from 'react'
import CommunitySettingsPage from '../../components/Community/CommunitySettingsPage'
import Nav from '../../components/Nav'
// import CommunityPage from '../../components/Settings/CommunityPage'
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
        {/* // <CommunityPage data={authState.user.community} /> */}
      </div>
    </>
  )
}