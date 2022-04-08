import React, { useContext } from 'react';
import { Typography } from '@mui/material';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CommunityName from '../../../../shared/CommunityName';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

export default function Welcome() {
    const authState = useContext(Context)

  return (
    <VerticallyCentered>
      <CommunityName authState={authState} />
      <Typography variant='h1'>Welcome</Typography>
    </VerticallyCentered>
  );
}
