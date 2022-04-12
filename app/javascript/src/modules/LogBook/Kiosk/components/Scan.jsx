import React from 'react';
import { Container } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import Scanner from '../../../../containers/Scan';
import CenteredContent from '../../../../shared/CenteredContent';
import BorderedButton from '../../../../shared/buttons/BorderedButton';
import { defaultColors } from '../../../../themes/nkwashi/theme';

export default function Scan() {
  const history = useHistory();
  const { t } = useTranslation('logbook')
  return (
    <VerticallyCentered>
      <br />
      <Container maxWidth="xs">
        <br />
        <Scanner isKiosk />

        <br />
        <br />
        <CenteredContent>
          <BorderedButton 
            title={t('kiosk.go_back')} 
            data-testid="back_to_welcome"
            onClick={() => history.push('/logbook/kiosk')}
            startIcon={<KeyboardBackspaceIcon />}
            borderColor={defaultColors.info}
            outlined
          />
        </CenteredContent>
      </Container>
    </VerticallyCentered>
  );
}
