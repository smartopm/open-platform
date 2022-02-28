import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'

// TODO: refactor this
/**
 * 
 * @returns 
 * @deprecated This should be replaced with label
 */
export default function StatusBadge({ label }) {
  switch (label.toLowerCase()) {
    case 'pending':
      return (
        <p className={css(styles.badge, styles.statusBadgePending)}>{label}</p>
      )
    case 'valid':
      return (
        <p className={css(styles.badge, styles.statusBadgeValid)}>
          <i className={`material-icons ${css(styles.icon)}`}>verified_user</i>
          {label}
        </p>
      )
    case 'expired':
      return (
        <p className={css(styles.badge, styles.statusBadgeInvalid)}>{label}</p>
      )
    case 'banned':
      return (
        <p className={css(styles.badge, styles.statusBadgeBanned)}>
          Not Allowed
        </p>
      )
    case 'verified': 
      return (
        <p className={css(styles.badge, styles.statusBadgeValid)}>
          <i className={`material-icons ${css(styles.icon)}`}>{label}</i>
          {label}
        </p>
      )
    case 'notVerified': 
      return (
        <p className={css(styles.badge, styles.statusBadgeInvalid)}>{label}</p>
      )
    default:
      return <p className={css(styles.statusBadgePending)}>{label}</p>
  }
}

StatusBadge.propTypes = {
  label: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  badge: {
    margin: '0',
    padding: '0 0.7em',
    borderRadius: '14px',
    width: '50%'
  },
  icon: {
    verticalAlign: 'middle',
    display: 'inline',
    fontSize: '1em',
    margin: 0,
    padding: '0 0.2em 0 0'
  },
  statusBadgePending: {
    border: '1px dashed #69ABA4',
    color: '#69ABA4'
  },
  statusBadgeValid: {
    border: '1px solid #69ABA4',
    color: '#fff',
    backgroundColor: '#69ABA4'
  },
  statusBadgeInvalid: {
    border: '1px solid #5d606b',
    color: '#fff',
    backgroundColor: '#5d606b'
  },
  statusBadgeInvalidSoon: {
    border: '1px solid #efa465',
    color: '#fff',
    backgroundColor: '#efa465'
  },
  statusBadgeBanned: {
    border: '1px solid #ed5757',
    color: '#fff',
    backgroundColor: '#ed5757'
  }
})
