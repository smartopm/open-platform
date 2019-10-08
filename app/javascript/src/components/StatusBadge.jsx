import React from 'react';
import { StyleSheet, css } from 'aphrodite';


export default function StatusBadge({label}) {
  switch(label.toLowerCase()) {
    case 'pending':
      return ( <p className={css(styles.badge, styles.statusBadgePending)}>{label}</p>)
    case 'valid':
      return ( <p className={css(styles.badge, styles.statusBadgeValid)}>
        <i className={`material-icons ${css(styles.icon)}`}>check</i>
        {label}
      </p>)
    case 'expired':
      return ( <p className={css(styles.badge, styles.statusBadgeInvalid)}>{label}</p>)
    case 'banned':
      return ( <p className={css(styles.badge, styles.statusBadgeBanned)}>{label}</p>)
    default:
      return ( <p className={css(styles.statusBadgePending)}>{label}</p>)
  }
}

const styles = StyleSheet.create({
  badge: {
    margin: '0',
    padding: '0 0.7em',
    borderRadius: '14px',
  },
  icon: {
    verticalAlign: 'middle',
    display: 'inline',
    fontSize: '1em',
    margin: 0,
    padding: '0 0.2em 0 0',
  },
  statusBadgePending: {
    border: '1px dashed #46ce84',
    color: '#46ce84',
  },
  statusBadgeValid: {
    border: '1px solid #46ce84',
    color: '#fff',
    backgroundColor: '#46ce84',
  },
  statusBadgeInvalid: {
    border: '1px solid #5d606b',
    color: '#fff',
    backgroundColor: '#5d606b',
  },
  statusBadgeInvalidSoon: {
    border: '1px solid #efa465',
    color: '#fff',
    backgroundColor: '#efa465',
  },
  statusBadgeBanned: {
    border: '1px solid #ed5757',
    color: '#fff',
    backgroundColor: '#ed5757' ,
  },
})
