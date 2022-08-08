import { Container, Grid, Typography } from '@mui/material';
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import CodeScreenWrapper from './CodeScreenWrapper';
import PasswordInput from '../../shared/PasswordInput';
import PasswordCheck from '../../shared/PasswordCheck';
import { passwordChecks } from '../../utils/helpers';
import { ResetPasswordAfterLoginMutation } from '../../graphql/mutations/user';
import useMutationWrapper from '../../shared/hooks/useMutationWrapper';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';

export default function PasswordSetup() {
  const { t } = useTranslation(['login', 'common']);
  const { state } = useLocation();
  const [passwordValue, setPasswordValue] = useState({
    password: '',
    confirmedPassword: '',
    showPassword: false,
  });
  const { verified, rules, definitions } = passwordChecks(
    passwordValue.password,
    passwordValue.confirmedPassword,
    t
  );

  const [
    resetPasswordAfterLogin,
    passwordResetLoading,
  ] = useMutationWrapper(ResetPasswordAfterLoginMutation, data => handleRouting(data));

  const authState = useContext(AuthStateContext);
  const { id } = useParams();

  function handleResetPassword() {
    resetPasswordAfterLogin({
      userId: id,
      password: passwordValue.password,
    });
  }

  function handleRouting(data) {
    authState.setToken({
      type: 'update',
      token: data?.resetPasswordAfterLogin?.authToken,
    });
  }
  if (!state?.firstTimeLogin) {
    return <Redirect to="/login" />;
  }
  return (
    <CodeScreenWrapper
      title={t('login.setup_password')}
      isDisabled={!verified || passwordResetLoading}
      loading={passwordResetLoading}
      handleConfirm={handleResetPassword}
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
        <br />
        <Typography gutterBottom marginLeft="32px">{`${t('common:misc.required')}:`}</Typography>
        <PasswordCheck checks={{ rules, definitions }} />
      </Container>
    </CodeScreenWrapper>
  );
}
