import React, { useContext } from 'react'
import LabelList from '../../components/Label/LabelList'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from "../Provider/AuthStateProvider"


export default function Labels(){
  const authState = useContext(AuthStateContext)
    return (
      <>
        <Nav
          menuButton="back"
          backTo='/'
        />
        <LabelList userType={authState.user.userType} />
      </>
    )
}
