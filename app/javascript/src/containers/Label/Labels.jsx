import React, { useContext } from 'react'
import LabelList from '../../components/Label/LabelList'
import AdminWrapper from '../../shared/AdminWrapper'
import { Context as AuthStateContext } from "../Provider/AuthStateProvider"


export default function Labels(){
  const authState = useContext(AuthStateContext)
    return (
      <AdminWrapper>
        <LabelList userType={authState?.user?.userType} />
      </AdminWrapper>
    )
}
