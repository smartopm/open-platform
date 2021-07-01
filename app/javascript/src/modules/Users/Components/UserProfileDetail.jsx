import React from 'react'
import { Link } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/styles';
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import dateutil from '../../../utils/dateutil'
import UserLabels from './UserLabels'
import StatusBadge from '../../../components/StatusBadge'

export default function UserDetail({ data, userType }) {
  const { t } = useTranslation('users')
  const theme = useTheme()
  return (
    <>
      <div>
        <div className={css(styles.name)}>{data.user.name}</div>
        <div className={css(styles.userType)}>
          {t(`common:user_types.${data?.user?.userType}`)}
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          {data?.user?.phoneNumber && (
          <div style={{display: 'flex'}}>
            <PhoneIcon style={{heigth: '5.6px', width: '13.6px', verticalAlign: 'middle', marginRight: '14px'}} />
            <Typography data-testid='phone' className={css(styles.info)}>
              {data.user.phoneNumber}
            </Typography>
          </div>
          )}
          {data?.user?.email && (
            <Divider orientation="vertical" flexItem style={{height: '8px', margin: '8px 10px 0 10px'}} />
          )}
          {data?.user?.email && (
          <div style={{display: 'flex'}}>
            <EmailIcon style={{heigth: '5.6px', width: '13.6px', verticalAlign: 'middle', marginRight: '14px'}} />
            <Typography data-testid='email' className={css(styles.info)}>
              {data?.user.email}
            </Typography>
          </div>
          )}
          {data?.user?.address && (
            <Divider orientation="vertical" flexItem style={{height: '8px', margin: '8px 10px 0 10px'}} />
          )}
          {data?.user?.address && (
          <div style={{display: 'flex'}}>
            <LocationOnIcon style={{heigth: '5.6px', width: '13.6px', verticalAlign: 'middle', marginRight: '14px'}} />
            <Typography data-testid='address' className={css(styles.info)}>
              {data?.user.address}
            </Typography>
          </div>
          )}
        </div>
        {['admin'].includes(userType) && <UserLabels userId={data.user.id} />}
      </div>
    </>
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
  },
  name: {
    fontWeight: 500,
    fontSize: '20px',
    color: '#141414'
  },
  userType: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#212121'
  },
  info: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#141414'
  }
})
