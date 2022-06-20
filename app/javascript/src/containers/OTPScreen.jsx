/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// One Time Passcode Screen
import React, { Fragment, useEffect, useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import Tooltip from '@mui/material/Tooltip';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { SendOneTimePasscode } from '../graphql/mutations';
import { formatError } from '../utils/helpers';
import { Spinner } from '../shared/Loading';
import PageWrapper from '../shared/PageWrapper';

// call the OTP function once this component renders
// this is to be consistent with the rest of the menu
export default function OTPFeedbackScreen() {
  const [errorMessage, setMessage] = useState('');
  const [userDetails, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { t } = useTranslation('common');
  const [sendOneTimePasscode] = useMutation(SendOneTimePasscode);

  function sendOTP() {
    sendOneTimePasscode({ variables: { userId: params.id } })
      .then(({ data }) => {
        setDetails({
          success: data.oneTimeLogin.success,
          url: data.oneTimeLogin.url
        });
        setLoading(false);
      })
      .catch(error => {
        setMessage(formatError(error.message));
        setLoading(false);
      });
  }

  function copyLink() {
    if (userDetails?.success) {
      navigator.clipboard.writeText(userDetails?.url);
      setMessage('Successfully copied the link');
    }
  }

  useEffect(() => {
    // call the mutation to send OTP
    sendOTP();
  }, [params.id]);

  return (
    <>
      {loading && <Spinner />}
      <PageWrapper
        pageTitle={t('misc.otp')}
        className={css(styles.passcodeSection)}
        data-testid="feedback"
      >
        <div data-testid="feedback">
          {userDetails?.success && (
            <p>
              The One Time Pass code was successfully sent
              <span className={css(styles.user)}>{userDetails?.user}</span>
            </p>
          )}
          <br />
          <Tooltip title={userDetails?.success ? 'Click to copy' : ''}>
            <div>
              {userDetails?.success && 'Url: '}
              <span onClick={copyLink} className={css(styles.url)} data-testid="link_copier">
                {' '}
                {userDetails?.url}
              </span>
            </div>
          </Tooltip>
          <br />
          <br />
          {Boolean(errorMessage.length) && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  passcodeSection: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -30%)'
  },
  url: {
    fontStyle: 'italic',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  user: {
    fontWeight: 'bold'
  },
  resendButton: {
    backgroundColor: '009688',
    color: '#343a40'
  }
});
