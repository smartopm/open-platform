import { Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CodeScreenWrapper from './CodeScreenWrapper';

export default function PasswordSetup() {
  const { t } = useTranslation('common');
  const [passwordValue, setPasswordValue] = useState({ password: '', passwordConfirm: '' });

  function handleConfirmCode() {}
  return (
    <CodeScreenWrapper
      title={t('login.otp_verification')}
      isDisabled={false}
      loading={false}
      handleConfirm={handleConfirmCode}
    >
      <Grid item xs={12}>
        <TextField
          name="name"
          label={t('common:form_fields.username')}
          value={passwordValue.password}
          onChange={event => setPasswordValue({ ...passwordValue, password: event.target.value })}
          variant="outlined"
          margin="dense"
          fullWidth
        />
        <TextField
          name="name"
          label={t('common:form_fields.password')}
          value={passwordValue.passwordConfirm}
          onChange={event =>
            setPasswordValue({ ...passwordValue, passwordConfirm: event.target.value })
          }
          variant="outlined"
          margin="normal"
          fullWidth
        />
      </Grid>
    </CodeScreenWrapper>
  );
}
