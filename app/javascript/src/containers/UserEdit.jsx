import React, { useContext } from 'react'
import { useLocation, useParams } from 'react-router'
import Nav from '../components/Nav'
import UserForm from '../components/UserForm'
import { Context } from './Provider/AuthStateProvider'

export default function FormContainer() {
  const { state, pathname } = useLocation()
  const { id } = useParams()
  const previousRoute = state && state.from
  const isFromRef = previousRoute === 'ref' || false
  const isEditing = pathname.includes('edit')
  const authState = useContext(Context)
  const isAdmin = authState.user.userType === 'admin'
  // Todo: Restructure 
  let title = 'New User'
  if (id) {
    title = 'Editing User'
  } else if (isFromRef) {
    title = 'Referrals'
  }

  return (
    <>
      <Nav
        navName={title}
        menuButton="back"
        backTo={id ? `/user/${id}` : '/'}
      />
      <br />
      <UserForm isEditing={isEditing} isFromRef={isFromRef} isAdmin={isAdmin} />
    </>
  )
}

FormContainer.displayName = 'UserForm'
