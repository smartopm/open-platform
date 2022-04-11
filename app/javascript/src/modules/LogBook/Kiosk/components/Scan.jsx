import React from 'react';
import { Container, Typography } from '@mui/material';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import Scanner from '../../../../containers/Scan';

export default function Scan() {
  return (
    <VerticallyCentered>
      <br />
      <br />
      <Container maxWidth="sm">
        <CenteredContent>
          <Typography variant="h6" textAlign="center">
            Please center you QR code on the screen below
          </Typography>
        </CenteredContent>
        <br />
        <Scanner isKiosk />
      </Container>
    </VerticallyCentered>
  );
}
