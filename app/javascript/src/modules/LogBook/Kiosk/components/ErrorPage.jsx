import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import { useParamsQuery } from '../../../../utils/helpers';
import useTimer from '../../../../utils/customHooks';
import BorderedButton from '../../../../shared/buttons/BorderedButton';

export default function ErrorPage() {
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
          <Typography variant="h2" textAlign="center" data-testid="error_title">
            {status === 'timeout' ? 'Error' : 'Access Denied'}
          </Typography>
        </CenteredContent>
        <br />
        <br />
        <CenteredContent>
          <Typography variant="h6" textAlign="center" data-testid="error_message">
            {status === 'timeout' ? 'QR code not detected' : 'Speak to the guard on duty'}
          </Typography>
        </CenteredContent>
        <br />
        <br />
        <CenteredContent>
          <BorderedButton 
            title="Try Again" 
            color="error"
            data-testid="try_again_message"
            onClick={() => history.push('/logbook/kiosk/scan')}
          />
        </CenteredContent>
      </Container>
    </VerticallyCentered>
  );
}
