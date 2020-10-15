/* eslint-disable */
import React from 'react'
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import dateutil from '../../utils/dateutil'
import UserLabels from '../UserLabels'
import StatusBadge from '../StatusBadge'
import { titleize } from '../../utils/helpers'

export default function UserDetail({ data, userType }) {
  return (
    <div className="col-4">
      <h5>{data.user.name}</h5>
      <div className="expires">
        User Type:{' '}
        {titleize(data.user.userType)}
      </div>
      <div className="expires">
        Expiration:{' '}
        {dateutil.isExpired(data.user.expiresAt) ? (
          <span className="text-danger">Already Expired</span>
        ) : (
          dateutil.formatDate(data.user.expiresAt)
        )}
      </div>
      <div className="expires">
        Last accessed: {dateutil.formatDate(data.user.lastActivityAt)}
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

const styles = StyleSheet.create({
  badge: {
    margin: '0',
    padding: '0 0.7em',
    borderRadius: '14px'
  },
  statusBadgeBanned: {
    border: '1px solid #ed5757',
    color: '#fff',
    backgroundColor: '#ed5757'
  }
})
