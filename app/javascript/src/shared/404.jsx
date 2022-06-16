import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@mui/material';

export default function Page404() {
  const history = useHistory()
  const { t } = useTranslation('common')

  return (
    <div style={{ textAlign: 'center', paddingTop: '17vh'}}>
      <Typography color="textPrimary" variant="h2" data-testid="404-header-text">{t('404.404')}</Typography>
      <Typography color="textSecondary" variant="body1" data-testid="404-offline-text">{t('404.oops')}</Typography>
      <br />
      <br />
      <Button
        onClick={() => history.push('/')}
        variant="contained"
        data-testid="404-action-btn"
        color="primary"
        style={{
          color: '#ffffff'
        }}
      >
        {t('404.action_text')}
      </Button>
    </div>
  );
}
