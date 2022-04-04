import React, { useContext } from 'react';
import { useLocation, useParams } from 'react-router';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import Forms from '../components/FormList';

export default function CommunityForms() {
  const path = useLocation().pathname;
  const { id } = useParams();
  const authState = useContext(Context);
  return (
    <>
      <Forms
        userType={authState?.user?.userType}
        community={authState.user?.community.name}
        path={path}
        id={id}
      />
    </>
  );
}
