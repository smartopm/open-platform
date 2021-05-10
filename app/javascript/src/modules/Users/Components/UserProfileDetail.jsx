import React from 'react'
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import dateutil from '../../../utils/dateutil'
import UserLabels from './UserLabels'
import StatusBadge from '../../../components/StatusBadge'
import { titleize } from '../../../utils/helpers'
import { userSubStatus } from '../../../utils/constants'

export default function UserDetail({ data, userType }) {
  const { t } = useTranslation('users')
  return (
    <div>
      <h5>{data.user.name}</h5>
      <div className="expires">
        {t("common:misc.user_type")}
        :
        {' '}
        {t(`common:user_types.${data.user.userType}`)}
      </div>
      {data.user.subStatus && (
        <div data-testid="user-sub-status">
          {t("common:misc.customer_journey_stage")}
          : 
          {' '}
          <span>{t(`common:sub_status.${data.user.subStatus}`)}</span>
        </div>
      )}
      <div className="expires">
        Expiration:
        {' '}
        {dateutil.isExpired(data.user.expiresAt) ? (
          <span className="text-danger">Already Expired</span>
        ) : (
          dateutil.formatDate(data.user.expiresAt)
        )}
      </div>
      <div className="expires">
        Last accessed: 
        {' '}
        {dateutil.formatDate(data.user.lastActivityAt)}
      </div>
      {['admin'].includes(userType) && (
        <Link to={`/entry_logs/${data.user.id}`}>Entry Logs &gt;</Link>
      )}
      <br />
      {dateutil.isExpired(data.user.expiresAt) ? (
        <p className={css(styles.badge, styles.statusBadgeBanned)}>Expired</p>
      ) : (
        ['admin'].includes(userType) && <StatusBadge label={data.user.state} />
      )}
      {['admin'].includes(userType) && <UserLabels userId={data.user.id} />}
    </div>
  )
}

UserDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  userType: PropTypes.string.isRequired
}


const styles = StyleSheet.create({
  badge: {
    margin: '0',
    padding: '0 0.7em',
    borderRadius: '14px',
    width: '50%'
  },
  statusBadgeBanned: {
    border: '1px solid #ed5757',
    color: '#fff',
    backgroundColor: '#ed5757'
  }
})
