import React, { useContext } from 'react';
import { Typography } from '@mui/material';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CommunityName from '../../../../shared/CommunityName';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';

export default function Welcome() {
    const authState = useContext(Context)

  return (
    <VerticallyCentered>
      <CenteredContent>
        <CommunityName authState={authState} />
      </CenteredContent>
      <CenteredContent>
        <Typography variant='h2' textAlign="center">Welcome</Typography>
      </CenteredContent>
      <br />
      <CenteredContent>
        <Typography variant='h4' textAlign="center">
          Please press the button below to scan youl OR code
        </Typography>
      </CenteredContent>
      <br />
    </VerticallyCentered>
  );
}
