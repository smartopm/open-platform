import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import useTimer from '../../../../utils/customHooks';
import BorderedButton from '../../../../shared/buttons/BorderedButton';

export default function AccessPage() {
  const time = useTimer(5);
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
          <Typography variant="h2" textAlign="center" data-testid="access_granted">
            Access Granted
          </Typography>
        </CenteredContent>

        <br />
        <br />
        <br />
        <CenteredContent>
          <Typography variant="h4" textAlign="center" data-testid="welcome_to_community">
            Welcome to DoubleGDP
          </Typography>
        </CenteredContent>
        <br />
        <br />
        <CenteredContent>
          <BorderedButton 
            title="New Scan" 
            color="success"
            data-testid="new_scan_btn"
            onClick={() => history.push('/logbook/kiosk/scan')}
          />
        </CenteredContent>
      </Container>
    </VerticallyCentered>
  );
}
