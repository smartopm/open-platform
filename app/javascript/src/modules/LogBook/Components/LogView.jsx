import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import MessageAlert from '../../../components/MessageAlert';
import { EntryRequestGrant } from '../../../graphql/mutations';
import { Spinner } from '../../../shared/Loading';

export default function LogView({ user, tab, handleAddObservation }) {
  const { t } = useTranslation(['common', 'logbook']);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '' });

  function handleGrantAccess() {
    setLoading(true);
    grantEntry({ variables: { id: user.refId, subject: 'visitor_entry' } })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('logbook:logbook.success_message', { action: t('logbook:logbook.granted') })
        });
        setLoading(false);
        handleAddObservation(user);
      })
      .catch(error => {
        setMessage({ isError: true, detail: error.message });
        setLoading(false);
      });
  }

  return (
    <>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-xs-8">
            <span className={css(styles.logTitle)}>{user.data.ref_name}</span>
          </div>
          <div className="col-xs-4">
            <span className={css(styles.subTitle)}>
              {tab === 2
                ? t('logbook:logbook.visit_scheduled', {
                    date: dateToString(user.entryRequest?.visitationDate),
                    time: dateTimeToString(user.entryRequest?.startTime)
                  })
                : `${dateToString(user.createdAt)} at ${dateTimeToString(user.createdAt)}`}
            </span>
          </div>
        </div>
        <br />
        <div className="row justify-content-between">
          <div className="col-xs-8">
            <span className={css(styles.subTitle)}>
              {t(`common:user_types.${user.data?.type}`)}
            </span>
          </div>
          {tab === 2 && (
            <div className="col-xs-4">
              <span className={css(styles.subTitle)}>
                <Typography
                  component="span"
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  onClick={handleGrantAccess}
                  data-testid="grant_access_btn"
                >
                  {loading ? <Spinner /> : t('logbook:access_actions.grant_access')}
                </Typography>
              </span>
            </div>
          )}
        </div>
        <br />
        <div className="border-top my-3" />
      </div>
    </>
  );
}

LogView.defaultProps = {
  handleAddObservation: () => {}
};

LogView.propTypes = {
  tab: PropTypes.number.isRequired,
  handleAddObservation: PropTypes.func,
  user: PropTypes.shape({
    refId: PropTypes.string,
    createdAt: PropTypes.string,
    data: PropTypes.shape({
      type: PropTypes.string,
      ref_name: PropTypes.string
    }),
    entryRequest: PropTypes.shape({
      visitationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    })
  }).isRequired
};

const styles = StyleSheet.create({
  logTitle: {
    color: '#1f2026',
    fontSize: 16,
    fontWeight: 700
  },
  subTitle: {
    color: '#818188',
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  },
  access: {
    color: '#1f2026',
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  }
});
