import React from 'react';
import { Button, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import { useParamsQuery } from '../../../../utils/helpers';

export default function Errorpage() {
  const path = useParamsQuery();
  const status = path.get('status');
  const history = useHistory();

  return (
    <VerticallyCentered backgroundColor="#D15249">
      <CenteredContent>
        <Typography variant="h2" textAlign="center">
          {status === 'timeout' ? 'Error' : 'Access Denied'}
        </Typography>
      </CenteredContent>
      <br />
      <br />
      <CenteredContent>
        <Typography variant="h6" textAlign="center">
          {status === 'timeout' ? 'QR code not detected' : 'Speak to the guard on duty'}
        </Typography>
      </CenteredContent>
      <br />
      <br />
      <CenteredContent>
        <Button
          color="error"
          variant="outlined"
          style={{ width: '70%', color: '#FFFFFF', border: '1px solid #FFFFFF' }}
          size="large"
          onClick={() => history.push('/logbook/kiosk/scan')}
        >
          Try Again
        </Button>
      </CenteredContent>
    </VerticallyCentered>
  );
}
