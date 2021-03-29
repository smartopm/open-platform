import React, { useContext } from 'react';
import { useLocation } from 'react-router';
import UserForm from '../components/UserForm';
import { Context } from './Provider/AuthStateProvider';

export default function FormContainer() {
  const { state, pathname } = useLocation();
  const previousRoute = state && state.from;
  const isFromRef = previousRoute === 'ref' || false;
  const isEditing = pathname.includes('edit');
  const authState = useContext(Context);
  const isAdmin = authState.user.userType === 'admin';

  return <UserForm isEditing={isEditing} isFromRef={isFromRef} isAdmin={isAdmin} />;
}

FormContainer.displayName = 'UserForm';
