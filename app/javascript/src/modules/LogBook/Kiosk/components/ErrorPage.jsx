import React, { useEffect } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import { useParamsQuery } from '../../../../utils/helpers';
import useTimer from '../../../../utils/customHooks';

export default function Errorpage() {
  const path = useParamsQuery();
  const status = path.get('status');
  const history = useHistory();
  const time = useTimer(10);

  useEffect(() => {
    if (time === 0) {
      history.push('/logbook/kiosk');
    }
  }, [history, time]);

  return (
    <VerticallyCentered backgroundColor="#D15249">
      <Container maxWidth="sm">
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
      </Container>
    </VerticallyCentered>
  );
}
