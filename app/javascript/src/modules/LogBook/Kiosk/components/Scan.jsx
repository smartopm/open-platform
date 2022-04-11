import React from 'react';
import { Container } from '@mui/material';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import Scanner from '../../../../containers/Scan';

export default function Scan() {
  return (
    <VerticallyCentered>
      <br />
      <Container maxWidth="sm">
        <br />
        <Scanner isKiosk />
      </Container>
    </VerticallyCentered>
  );
}
