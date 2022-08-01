import React, {
  useContext,
} from 'react'
import { Box, Button, CircularProgress, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import { StyleSheet, css } from 'aphrodite'
import { Link, useLocation, Redirect } from 'react-router-dom'
import {  useQuery } from 'react-apollo'
import PropTypes from 'prop-types';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { CurrentCommunityQuery } from '../../modules/Community/graphql/community_query'
import { Spinner } from '../../shared/Loading'
import ImageAuth from '../../shared/ImageAuth'
import CenteredContent from '../../shared/CenteredContent'

/**
 * @param {Boolean} isOtpScreen - (optional) if set, show the OTP code resend button
 * @param {Boolean} loading - (optional) for rendering loader spinner
 * @param {Function} handleResend - (optional) function to handle resend of OTP code
 * @param {Function} handleConfirm - (required) function to handle resend of OTP code
 * @param {String} code - (optional) a string representing the current OTP code / password
 * @returns HOC component for code / password confirmation screen
 */
export default function CodeScreenWrapper({
  isDisabled, loading, handleConfirm, title, children
}) {
  const authState = useContext(AuthStateContext)
  const { data: communityData, loading: communityLoading } = useQuery(CurrentCommunityQuery)
  const { state } = useLocation()
  const theme = useTheme();
  const { t } = useTranslation(['login', 'common']);
  const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

  // Redirect once our authState.setToken does it's job
  if (authState.loggedIn) {
    return <Redirect to={state ? state.from : '/'} /> // state.from
  }

  const displayLogo = communityData?.currentCommunity?.imageUrl ? (
    <Grid data-testid="community_logo">
      <ImageAuth
        imageLink={communityData?.currentCommunity?.imageUrl}
        className={css(styles.logo)}
        alt="community logo"
      />
    </Grid>
  ) : (
    <Grid data-testid="community_name">
      <Typography variant={mobileMatches ? 'h6' : 'h5'} color="primary">
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
        <Box mt={2} mb={5}>
          <CenteredContent>{communityLoading ? <Spinner /> : displayLogo}</CenteredContent>
        </Box>

        <CenteredContent>
          <Typography
            variant="subtitle2"
            data-testid="screen_title"
            fontSize={mobileMatches ? '16px' : '18px'}
            mb={6}
          >
            {title}
          </Typography>
        </CenteredContent>

        {children}

        <div
          className={`row justify-content-center align-items-center ${css(styles.linksSection)}`}
        >
          <Button
            variant="contained"
            className={`${css(styles.getStartedButton)}`}
            onClick={handleConfirm}
            disabled={isDisabled}
            color="primary"
            data-testid="submit_btn"
            endIcon={!loading && <ArrowForwardIcon />}
          >
            {loading ? (
              <CircularProgress size={25} color="primary" />
            ) : (
              <span>{t('login.continue_button_text')}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

CodeScreenWrapper.defaultProps = {
  isDisabled: false,
  loading: false,
};

CodeScreenWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

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
    height: 50,
  }
});
