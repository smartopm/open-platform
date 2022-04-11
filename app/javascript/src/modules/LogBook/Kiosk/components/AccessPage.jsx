import React, { useContext, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CenteredContent from '../../../../shared/CenteredContent';
import useTimer from '../../../../utils/customHooks';
import BorderedButton from '../../../../shared/buttons/BorderedButton';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { defaultColors } from '../../../../themes/nkwashi/theme';

export default function AccessPage() {
  const time = useTimer(10);
  const history = useHistory();
  const authState = useContext(Context);
  const { t } = useTranslation('logbook')

  useEffect(() => {
    if (time === 0) {
      history.push('/logbook/kiosk');
    }
  }, [history, time]);

  return (
    <VerticallyCentered backgroundColor={defaultColors.success} timer={15}>
      <Container maxWidth="xs">
        <CenteredContent>
          <Typography variant="h2" textAlign="center" data-testid="access_granted">
            {t('kiosk.access_granted')}
          </Typography>
        </CenteredContent>

        <br />
        <br />
        <br />
        <CenteredContent>
          <Typography variant="h6" textAlign="center" data-testid="welcome_to_community">
            {`Welcome to ${authState.user.community.name}`}
          </Typography>
        </CenteredContent>
        <br />
        <br />
        <CenteredContent>
          <BorderedButton 
            title={t('kiosk.new_scan')}
            borderColor={defaultColors.white}
            data-testid="new_scan_btn"
            onClick={() => history.push('/logbook/kiosk/scan')}
            outlined
          />
        </CenteredContent>
      </Container>
    </VerticallyCentered>
  );
}
