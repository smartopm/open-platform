import React from 'react';
import { useTranslation } from 'react-i18next';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';

export default function LogView({ user}) {
  const { t } = useTranslation(['common']);
  return (
    <>
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-xs-8">
            <span className={css(styles.logTitle)}>{user.data.ref_name}</span>
          </div>
          <div className="col-xs-4">
            <span className={css(styles.subTitle)}>
              {`${dateToString(user.createdAt)} at ${dateTimeToString(user.createdAt)}`}
            </span>
          </div>
        </div>
        <br />
        <div className="row justify-content-between">
          <div className="col-xs-8">
            <span className={css(styles.subTitle)}>
              {t(`user_types.${user.data?.type}`)}
            </span>
          </div>
        </div>
        <br />
        <div className="border-top my-3" />
      </div>
    </>
  );
}


LogView.propTypes = {
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
