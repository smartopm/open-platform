import React, {
  useState,
  useContext,
} from 'react'
import { Box, TextField } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { loginPhoneConfirmCode, loginPhoneMutation } from '../../graphql/mutations'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { ifNotTest } from '../../utils/helpers';
import CodeScreenWrapper from './CodeScreenWrapper'
import CenteredContent from '../../shared/CenteredContent'

export default function ConfirmCodeScreen({ match }) {
  const authState = useContext(AuthStateContext)
  const { id } = match.params
  const [loginPhoneComplete] = useMutation(loginPhoneConfirmCode)
  const [resendCodeToPhone] = useMutation(loginPhoneMutation)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()
  const { t } = useTranslation(['login', 'common'])
  const [otpCode, setOtpCode] = useState('')
  const classes = useStyles();

  function resendCode() {
    setIsLoading(true)
    resendCodeToPhone({
      variables: { phoneNumber: (state && state.phoneNumber) || '' }
    })
      .then(() => {
        setIsLoading(false)
        setMsg(`We have resent the code to +${state.phoneNumber}`)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }

  function handleConfirmCode() {
    setIsLoading(true)

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
        setIsLoading(false);
      });
  }

  return (
    <CodeScreenWrapper
      title={t('login.otp_verification')}
      isOtpScreen
      loading={isLoading}
      handleResend={resendCode}
      handleConfirm={handleConfirmCode}
      code={otpCode}
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

        <div style={{ marginTop: '30px' }}>
          {error && <p className="text-center text-danger">{error}</p>}
          {msg && <p className="text-center text-primary">{msg}</p>}
        </div>
      </CenteredContent>
    </CodeScreenWrapper>
  );
}

ConfirmCodeScreen.propTypes = {
  match: PropTypes.shape(PropTypes.Object).isRequired,
}

const useStyles = makeStyles(() => ({
  helperText: {
    textAlign: 'center',
  },
}));