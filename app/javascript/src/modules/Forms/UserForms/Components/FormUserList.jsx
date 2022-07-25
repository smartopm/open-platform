import React, { useContext } from 'react';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import UserFilledForms from '../../../Users/Components/UserFilledForms';


export default function FormUserList() {
  const authState = useContext(Context);

  return (
    <UserFilledForms
      userId={authState.user.id}
      currentUser={authState.user.id}
      user={authState.user}
    />
  );
}
