import React from 'react';
import { Typography } from '@mui/material';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import Scanner from '../../../../containers/Scan';

export default function Scan() {
  return (
    <VerticallyCentered>
      <br />
      <br />
      <CenteredContent>
        <Typography variant="body" textAlign="center">
          Please center you OR code on the
        </Typography>
      </CenteredContent>
      <br />
      <Scanner isKiosk />
    </VerticallyCentered>
  );
}
