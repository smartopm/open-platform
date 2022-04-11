import React, { useContext } from 'react';
import { Typography, Button, Box, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CommunityName from '../../../../shared/CommunityName';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';

export default function Welcome() {
  const authState = useContext(Context);
  const history = useHistory();
  const { t } = useTranslation('logbook')
  return (
    <VerticallyCentered isVerticallyCentered={false}>
      <Container maxWidth="sm">
        <Box component="div" sx={{ marginTop: '130px', marginLeft: '30px' }}>
          <CommunityName authState={authState} />
        </Box>
        <br />
        <br />
        <CenteredContent>
          <Typography variant="h2" textAlign="center" data-testid="welcome_to_kiosk">
            {t('kiosk.welcome')}
          </Typography>
        </CenteredContent>
        <br />
     
        <CenteredContent>
          <Typography variant="h6" textAlign="center">
            {t('kiosk.press_btn_to_scan')}
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
            data-testid="start_scan_btn"
            onClick={() => history.push('/logbook/kiosk/scan')}
          >
            {t('kiosk.start_scan')}
          </Button>
        </CenteredContent>
        <br />
        <br />
        <br />
      
        <CenteredContent>
          <Typography variant='subtitle1' textAlign="center" data-testid="no_qr_code_text">
            {t('kiosk.no_qr_code_text')}
          </Typography>
        </CenteredContent>
      </Container>
    </VerticallyCentered>
  );
}
