import React from 'react';
import { Button, Typography } from '@mui/material';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';

export default function Accesspage() {
  return (
    <VerticallyCentered backgroundColor="#67B388">
      <CenteredContent>
        <Typography variant="h2" textAlign="center">Accessed denied</Typography>
      </CenteredContent>

      <CenteredContent>
        <Typography variant="h3" textAlign="center">Welcome to DoubleGDP</Typography>
      </CenteredContent>
      <CenteredContent>

        <Button color='primary'>Try Again</Button>
      </CenteredContent>
    </VerticallyCentered>
  );
}
