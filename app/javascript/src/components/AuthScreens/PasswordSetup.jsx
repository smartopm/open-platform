import { Container, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CodeScreenWrapper from './CodeScreenWrapper';
import PasswordInput from '../../shared/PasswordInput';

export default function PasswordSetup() {
  const { t } = useTranslation(['login', 'common']);
  const [passwordValue, setPasswordValue] = useState({
    password: '',
    confirmedPassword: '',
    showPassword: false,
  });

  function handleConfirmCode() {}
  return (
    <CodeScreenWrapper
      title={t('login.setup_password')}
      isDisabled={false}
      loading={false}
      handleConfirm={handleConfirmCode}
    >
      <Container maxWidth="sm">
        <Grid item xs={12}>
          <PasswordInput
            label={t('common:form_fields.password')}
            type="password"
            passwordValue={passwordValue}
            setPasswordValue={setPasswordValue}
          />
          <br />
          <br />
          <PasswordInput
            label={t('common:form_fields.confirm_password')}
            type="confirmedPassword"
            passwordValue={passwordValue}
            setPasswordValue={setPasswordValue}
          />
        </Grid>
      </Container>
    </CodeScreenWrapper>
  );
}
