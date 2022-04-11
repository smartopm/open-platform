import React from 'react';
import { Button, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import Scanner from '../../../../containers/Scan';
import CenteredContent from '../../../../shared/CenteredContent';

export default function Scan() {
  const history = useHistory();
  const { t } = useTranslation('logbook')
  return (
    <VerticallyCentered>
      <br />
      <Container maxWidth="sm">
        <br />
        <Scanner isKiosk />

        <br />
        <br />
        <CenteredContent>
          <Button
            variant="outlined"
            color="primary"
            disableElevation
            style={{ width: '70%' }}
            size="large"
            data-testid="back_to_welcome"
            onClick={() => history.push('/logbook/kiosk')}
            startIcon={<KeyboardBackspaceIcon />}

          >
            {t('kiosk.go_back')}
          </Button>
        </CenteredContent>
      </Container>
    </VerticallyCentered>
  );
}
