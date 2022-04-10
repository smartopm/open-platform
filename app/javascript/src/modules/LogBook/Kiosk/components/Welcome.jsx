import React, { useContext } from 'react';
import { Typography, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CommunityName from '../../../../shared/CommunityName';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';

export default function Welcome() {
  const authState = useContext(Context);
  const history = useHistory();

  return (
    <VerticallyCentered isVerticallyCentered={false}>
      <CenteredContent>
        <CommunityName authState={authState} />
      </CenteredContent>
      <CenteredContent>
        <Typography variant="h2" textAlign="center">
          Welcome
        </Typography>
      </CenteredContent>
      <br />
      <CenteredContent>
        <Typography variant="h4" textAlign="center">
          Please press the button below to scan youl OR code
        </Typography>
      </CenteredContent>
      <br />
      <br />
      <br />

      <CenteredContent>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          style={{ width: '70%' }}
          size="large"
          onClick={() => history.push('/logbook/kiosk/scan')}
        >
          Start Scan
        </Button>
      </CenteredContent>
      <br />
      <br />
      <br />

      <CenteredContent>
        <Typography variant='body' textAlign="center">
          If you do not have a QR code, please speak to the guard on duty
        </Typography>
      </CenteredContent>
    </VerticallyCentered>
  );
}
