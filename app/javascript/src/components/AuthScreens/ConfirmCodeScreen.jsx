import React, {
  useState,
  useContext,
} from 'react'
import { Box, Button, CircularProgress, Grid, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { StyleSheet, css } from 'aphrodite'
import { Link, useLocation, Redirect } from 'react-router-dom'
import { useMutation, useQuery } from 'react-apollo'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import makeStyles from '@mui/styles/makeStyles';
import { loginPhoneConfirmCode, loginPhoneMutation } from '../../graphql/mutations'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import useTimer from '../../utils/customHooks'
import { CurrentCommunityQuery } from '../../modules/Community/graphql/community_query'
import { Spinner } from '../../shared/Loading'
import { ifNotTest } from '../../utils/helpers';
import ImageAuth from '../../shared/ImageAuth'
import CenteredContent from '../../shared/CenteredContent'

/* istanbul ignore next */
export default function ConfirmCodeScreen({ match }) {
  const authState = useContext(AuthStateContext)
  const { id } = match.params
  const [loginPhoneComplete] = useMutation(loginPhoneConfirmCode)
  const [resendCodeToPhone] = useMutation(loginPhoneMutation)
  const { data: communityData, loading } = useQuery(CurrentCommunityQuery)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()
  const timer = useTimer(10, 1000)
  const { t } = useTranslation(['login', 'common'])
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
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

  // Redirect once our authState.setToken does it's job
  if (authState.loggedIn) {
    return <Redirect to={state ? state.from : '/'} /> // state.from
  }

  const displayLogo = (
    communityData?.currentCommunity?.imageUrl)
    ? (
      <Grid data-testid="community_logo">
        <ImageAuth
          imageLink={communityData?.currentCommunity?.imageUrl}
          className={css(styles.logo)}
          alt="community logo"
        />
      </Grid>
      )
    : (
      <Grid data-testid="community_name">
        <Typography variant={mobileMatches ? 'h6' : 'h5'} mt={2} mb={5} color="primary">
          {communityData?.currentCommunity?.name}
        </Typography>
      </Grid>
    );

  return (
    <div style={{ height: '100vh' }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to="/login">
          <i className="material-icons" data-testid="arrow_back">
            arrow_back
          </i>
        </Link>
      </nav>
      <div className="container">
        <CenteredContent>{loading ? <Spinner /> : displayLogo}</CenteredContent>

        <CenteredContent>
          <Typography
            variant="subtitle2"
            data-testid="otp_verification"
            fontSize={mobileMatches ? '16px' : '18px'}
            mb={6}
          >
            {t('login.otp_verification')}
          </Typography>
        </CenteredContent>

        <div className="row justify-content-center align-items-center">
          <Box sx={{ width: '400px', mx: 2, mt: '30px' }}>
            <TextField
              variant="outlined"
              autoFocus={ifNotTest()}
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
        </div>

        <div style={{ marginTop: '30px' }}>
          {error && <p className="text-center text-danger">{error}</p>}
          {msg && <p className="text-center text-primary">{msg}</p>}
        </div>

        <div
          className={`row justify-content-center align-items-center ${css(styles.linksSection)}`}
        >
          <Button
            variant="contained"
            className={`${css(styles.getStartedButton)}`}
            onClick={handleConfirmCode}
            disabled={isLoading || otpCode.trim().length < 6}
            color="primary"
            data-testid="submit_btn"
            endIcon={isLoading ? '' : <ArrowForwardIcon />}
          >
            {isLoading ? (
              <CircularProgress size={25} color="primary" />
            ) : (
              <span>{t('login.continue_button_text')}</span>
            )}
          </Button>
        </div>

        {/* show a button to re-send code */}
        {timer === 0 && (
          <div
            className={`row justify-content-center align-items-center ${css(styles.linksSection)}`}
          >
            <Button onClick={resendCode} disabled={isLoading}>
              {isLoading ? `${t('common:misc.loading')} ...` : t('login.resend_code')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

ConfirmCodeScreen.propTypes = {
  match: PropTypes.shape(PropTypes.Object).isRequired,
}

const styles = StyleSheet.create({
  getStartedButton: {
    height: 50,
    width: '400px',
    margin: '0px 16px',
    boxShadow: 'none',
    marginTop: 50,
  },
  linksSection: {
    marginTop: 20,
  },
  navBar: {
    boxShadow: 'none',
    backgroundColor: '#fafafa',
  },
  logo: {
    '@media (max-width: 600px)': {
      height: 35,
    },
    '@media (max-width: 350px)': {
      marginLeft: 6,
      height: 30,
    },
    '@media (min-width: 350px) and (max-width: 405px)': {
      marginLeft: '1.8em',
      height: 25,
    },
    '@media (min-width: 406px) and (max-width: 470px)': {
      marginLeft: '3em',
    },
    '@media (min-width: 470px) and (max-width: 500px)': {
      marginLeft: '5em',
    },
    '@media (min-width: 501px) and (max-width: 550px)': {
      marginLeft: '-3em',
    },
  }
});

const useStyles = makeStyles(() => ({
  helperText: {
    textAlign: 'center',
  },
}));