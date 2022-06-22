/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router';
import { StyleSheet, css } from 'aphrodite';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../components/DateContainer';
import { differenceInHours } from '../../../utils/dateutil';
import PageWrapper from '../../../shared/PageWrapper';

export default function CustodianTimeSheetLog({ data }) {
  const history = useHistory();
  const { t } = useTranslation(['common', 'timecard']);

  function routeToEmployee({ userId, name }) {
    history.push({
      pathname: `/timesheet/${userId}`,
      state: {
        name
      }
    });
  }

  return (
    <PageWrapper pageTitle={t('misc.time_card')}>
      {data?.timeSheetLogs.map(shift => (
        <React.Fragment key={shift.id}>
          <div className="row justify-content-between">
            <div className="col-xs-8 nz_user shift-user-name">
              <strong>{shift.user.name}</strong>
            </div>
            <div className="col-xs-4">
              <span className={css(styles.subTitle)}>
                {t('timecard:timecard.last_shift_worked')}
                :
                {dateToString(shift.startedAt)}
              </span>
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="col-xs-8" />
            <div className="col-xs-4 nz_endshift">
              <span className={css(styles.subTitle)}>
                {t('timecard:timecard.shift_worked_count')}
                :
                {' '}
                {shift.endedAt
                  ? `${differenceInHours(shift.startedAt, shift.endedAt)}`
                  : 'In-Progress'}
              </span>
            </div>
          </div>
          <div className="d-flex flex-row-reverse">
            <Typography
              component="span"
              color="primary"
              style={{
                cursor: 'pointer'
              }}
              onClick={() =>
                routeToEmployee({
                  userId: shift.userId,
                  name: shift.user.name
                })
              }
            >
              {t('misc.more_details')}
            </Typography>
          </div>
          <div className="border-top my-3" />
        </React.Fragment>
      ))}
    </PageWrapper>
  );
}

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
  }
});
