/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import { Spinner } from '../../../shared/Loading';
import authStateProps from '../../../shared/types/authState';

export default function VisitEntryLogs({
  eventLogs,
  authState,
  routeToAction,
  handleAddObservation,
  handleExitEvent,
  logDetails
}) {
  const { t } = useTranslation('logbook');
  const history = useHistory();

  function enrollUser(event) {
    return history.push({
      pathname: `/request/${event.refId}?tabValue=0`,
      state: { from: 'enroll', offset: logDetails.offset }
    });
  }

  if (!eventLogs) {
    return t('logbook.no_entry');
  }
  return eventLogs.map(event => {
    // Todo: To be followed up
    const source =
      event.subject === 'user_entry'
        ? t('dashboard:dashboard.scan')
        : t('dashboard:dashboard.log_entry');

    const isDigital = event.subject === 'user_entry' ? event.data.digital : null;
    const reason = event.entryRequest ? event.entryRequest.reason : '';

    const accessStatus =
      event.entryRequest && event.entryRequest.grantedState === 1
        ? `${t('logbook.granted_access')}: `
        : event.entryRequest && event.entryRequest.grantedState === 2
        ? `${t('logbook.denied_access')}: `
        : '';

    const enrolled = event.data.enrolled || false;
    const visitorName = event.data.ref_name || event.data.visitor_name || event.data.name;
    return (
      <Fragment key={event.id}>
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xs-8">
              <span
                className={`${css(styles.logTitle)} entry-log-visitor-name`}
                data-testid="visitor_name"
              >
                {visitorName}
              </span>
            </div>
            <div className="col-xs-4">
              <span className={css(styles.access)} data-testid="access_status">
                <strong>
                  {event.subject !== 'user_temp' && accessStatus}
                  {' '}
                </strong>
              </span>
              <span className={css(styles.subTitle)} data-testid="entry_date">
                {/* if an event is entry_request then it should show when it was granted or denied instead of when it was created */}
                {dateToString(event.createdAt)}
              </span>
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="col-xs-8">
              <span className={css(styles.subTitle)} data-testid="entry_reason">
                {reason}
              </span>
            </div>
            <div className="col-xs-4">
              <span className={css(styles.subTitle)} data-testid="entry_time">
                {dateTimeToString(event.createdAt)}
              </span>
            </div>
          </div>
          <br />
          <div className="row justify-content-between">
            <div className="col-xs-8">
              <span className={css(styles.subTitle)} data-testid="acting_user">
                {event.entryRequest?.grantor && event.entryRequest?.grantor?.name}
              </span>
            </div>
            <div className="col-xs-4">
              {/* Temperature status placeholder */}
              <span className={css(styles.subTitle)}>
                {' '}
                {/* eslint-disable-next-line no-useless-concat */}
                {event.subject === 'user_temp' ? `${t('logbook.temperature_recorded')} |` : ''}
              </span>

              <span className={css(styles.subTitle)}>
                {event.subject === 'visitor_entry' &&
                authState.user.userType === 'admin' &&
                !enrolled ? (
                  <>
                    <Typography
                      component="span"
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => enrollUser(event)}
                    >
                      {t('logbook.enroll_user')}
                      {' '}
                    </Typography>
                    |
                    {' '}
                    {source}
                  </>
                ) : event.subject === 'user_entry' && isDigital !== null ? (
                  isDigital ? (
                    t('logbook.digital_scan')
                  ) : (
                    t('logbook.print_scan')
                  )
                ) : (
                  source
                )}
                {' '}
                |
                {' '}
                <Typography
                  component="span"
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    routeToAction(event);
                  }}
                >
                  {t('common:misc.more_details')}
                </Typography>
                {' '}
                |
                {' '}
                <Typography
                  component="span"
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleAddObservation(event)}
                >
                  {t('logbook.add_observation')}
                </Typography>
                {' '}
                |
                {' '}
                {!event.data.exited && (
                  <Typography
                    component="span"
                    color="primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleExitEvent(event, 'exit')}
                    data-testid="log_exit"
                  >
                    {logDetails.clickedEvent.refId === event.refId &&
                    logDetails.observationDetails.loading ? (
                      <Spinner />
                    ) : (
                      event.subject !== 'user_temp' && t('logbook.log_exit')
                    )}
                  </Typography>
                )}
              </span>
            </div>
          </div>
          <br />
        </div>

        <div className="border-top my-3" />
      </Fragment>
    );
  });
}

VisitEntryLogs.propTypes = {
  eventLogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      refId: PropTypes.string,
      refType: PropTypes.string,
      subject: PropTypes.string,
      sentence: PropTypes.string,
      // eslint-disable-next-line react/forbid-prop-types
      data: PropTypes.object,
      actingUser: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string
      }),
      entryRequest: PropTypes.shape({
        reason: PropTypes.string,
        id: PropTypes.string,
        grantedState: PropTypes.grantedState,
        grantedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        name: PropTypes.string,
        startsAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        visitationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      }),
      user: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        userType: PropTypes.string,
      })
    })
  ),
  authState: authStateProps,
  routeToAction: PropTypes.func.isRequired,
  handleAddObservation: PropTypes.func.isRequired,
  handleExitEvent: PropTypes.func.isRequired,
  logDetails: PropTypes.shape({
    clickedEvent: PropTypes.shape({ refId: PropTypes.string }),
    observationDetails: PropTypes.shape({ loading: PropTypes.bool }),
    offset: PropTypes.number
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
