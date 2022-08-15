import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { loginPhoneConfirmCode, loginPhoneMutation } from '../../graphql/mutations';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';
import { ifNotTest } from '../../utils/helpers';
import CodeScreenWrapper from './CodeScreenWrapper';
import CenteredContent from '../../shared/CenteredContent';
import useTimer from '../../utils/customHooks';

export default function ConfirmCodeScreen({ match }) {
  const authState = useContext(AuthStateContext);
  const { id } = match.params;
  const [loginPhoneComplete] = useMutation(loginPhoneConfirmCode);
  const [resendCodeToPhone] = useMutation(loginPhoneMutation);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const { t } = useTranslation(['login', 'common']);
  const [otpCode, setOtpCode] = useState('');
  const timer = useTimer(10, 1000);
  const classes = useStyles();

  function resendCode() {
    setIsLoading(true);
    resendCodeToPhone({
      variables: { phoneNumber: (state && state.phoneNumber) || '' },
    })
      .then(() => {
        setIsLoading(false);
        setError(null);
        setMsg(`We have resent the code to +${state.phoneNumber}`);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }

  function handleConfirmCode() {
    setIsLoading(true);

    loginPhoneComplete({
      variables: { id, token: otpCode },
      errorPolicy: 'none',
    })
      .then(({ data }) => {
        authState.setToken({
          type: 'update',
          token: data.loginPhoneComplete.authToken,
        });
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message.replace(/GraphQL error:/, ''));
        setMsg(null);
        setIsLoading(false);
      });
  }

  return (
    <CodeScreenWrapper
      title={t('login.otp_verification')}
      isDisabled={isLoading || otpCode?.length < 6}
      loading={isLoading}
      handleConfirm={handleConfirmCode}
    >
      <CenteredContent>
        <Box sx={{ width: '400px', mx: 2, mt: '30px' }}>
          <TextField
            variant="outlined"
            autoFocus={ifNotTest()}
            name="otp_code_input"
            value={otpCode}
            onChange={e => setOtpCode(e.target.value.trim())}
            data-testid="otp_code_input"
            label={t('login.enter_code')}
            helperText={t('login.verification_code_helper')}
            type="number"
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
          />
        </Box>
      </CenteredContent>
      <CenteredContent>
        <div style={{ marginTop: 30, marginBottom: 24 }}>
          <Typography color="textSecondary" component="span">
            <Box sx={{ color: 'error.main' }}>{error}</Box>
          </Typography>
          <Typography component="span">
            <Box sx={{ color: 'primary.main' }}>{msg}</Box>
          </Typography>
        </div>
      </CenteredContent>
      {timer === 0 && (
        <CenteredContent>
          <Button onClick={resendCode} disabled={isLoading}>
            {isLoading ? `${t('common:misc.loading')} ...` : t('login.resend_code')}
          </Button>
        </CenteredContent>
      )}
    </CodeScreenWrapper>
  );
}

ConfirmCodeScreen.propTypes = {
  match: PropTypes.shape(PropTypes.Object).isRequired,
};

const useStyles = makeStyles(() => ({
  helperText: {
    textAlign: 'center',
  },
  linksSection: {
    marginTop: 20,
  },
}));
