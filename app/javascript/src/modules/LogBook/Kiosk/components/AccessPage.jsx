import React, { useEffect } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import useTimer from '../../../../utils/customHooks';

export default function Accesspage() {
  const time = useTimer(10);
  const history = useHistory();

  useEffect(() => {
    if (time === 0) {
      history.push('/logbook/kiosk');
    }
  }, [history, time]);

  return (
    <VerticallyCentered backgroundColor="#67B388" timer={15}>
      <Container maxWidth="sm">
        <CenteredContent>
          <Typography variant="h2" textAlign="center">
            Access Granted
          </Typography>
        </CenteredContent>

        <br />
        <br />
        <br />
        <CenteredContent>
          <Typography variant="h4" textAlign="center">
            Welcome to DoubleGDP
          </Typography>
        </CenteredContent>
        <br />
        <br />
        <CenteredContent>
          <Button
            color="success"
            variant="outlined"
            style={{ width: '70%', color: '#FFFFFF', border: '1px solid #FFFFFF' }}
            size="large"
            onClick={() => history.push('/logbook/kiosk/scan')}
          >
            New Scan
          </Button>
        </CenteredContent>
      </Container>
    </VerticallyCentered>
  );
}
