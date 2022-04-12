import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import { useParamsQuery } from '../../../../utils/helpers';
import useTimer from '../../../../utils/customHooks';
import BorderedButton from '../../../../shared/buttons/BorderedButton';
import { defaultColors } from '../../../../themes/nkwashi/theme';

export default function ErrorPage() {
  const path = useParamsQuery();
  const status = path.get('status');
  const history = useHistory();
  const time = useTimer(10);
  const { t } = useTranslation(['logbook', 'common'])

  useEffect(() => {
    if (time === 0) {
      history.push('/logbook/kiosk');
    }
  }, [history, time]);

  return (
    <VerticallyCentered backgroundColor={defaultColors.error}>
      <Container maxWidth="xs">
        <CenteredContent>
          <Typography variant="h2" textAlign="center" data-testid="error_title">
            {status === 'timeout' ? t('common:misc.error') : t('kiosk.access_denied')}
          </Typography>
        </CenteredContent>
        <br />
        <br />
        <CenteredContent>
          <Typography variant="h6" textAlign="center" data-testid="error_message">
            {status === 'timeout' ? t('kiosk.qr_not_detected') : t('kiosk.speak_to_guard_on_duty')}
          </Typography>
        </CenteredContent>
        <br />
        <br />
        <CenteredContent>
          <BorderedButton 
            title={t('kiosk.try_again')} 
            borderColor={defaultColors.white}
            data-testid="try_again_message"
            onClick={() => history.push('/logbook/kiosk/scan')}
            outlined
          />
        </CenteredContent>
      </Container>
    </VerticallyCentered>
  );
}
