import React, { useContext } from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'aphrodite';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CommunityName from '../../../../shared/CommunityName';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';
import BorderedButton from '../../../../shared/buttons/BorderedButton';
import { defaultColors } from '../../../../themes/nkwashi/theme';

export default function Welcome() {
  const authState = useContext(Context);
  const history = useHistory();
  const { t } = useTranslation('logbook')
  return (
    <VerticallyCentered isVerticallyCentered={false}>
      <Container maxWidth="xs">
        <Box component="div" sx={{ marginTop: '130px', marginLeft: '30px' }}>
          <CommunityName authState={authState} logoStyles={styles} />
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
          <BorderedButton 
            title={t('kiosk.start_scan')} 
            data-testid="start_scan_btn"
            onClick={() => history.push('/logbook/kiosk/scan')}
            borderColor={defaultColors.info}
          />
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

// I used aphrodite here because those are the styles the component is expecting
const styles = StyleSheet.create({
  logo: {
    margin: '-10px 0 0 21%',
    width: '51%',
    height: '25%'
  }
});
