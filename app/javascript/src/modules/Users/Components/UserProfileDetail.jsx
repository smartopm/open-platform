import React, { useContext } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import UserLabels from './UserLabels';
import CaptureTemp from '../../../components/CaptureTemp';
import { Context } from '../../../containers/Provider/AuthStateProvider';

export default function UserDetail({ data, userType }) {
  const { t } = useTranslation('users');
  const matches = useMediaQuery('(max-width:600px)');
  const authState = useContext(Context)
  return (
    <>
      <div>
        <div className={css(styles.name)}>{data.user.name}</div>
        <div className={css(styles.userType)}>{t(`common:user_types.${data?.user?.userType}`)}</div>
        <div style={matches ? null : { display: 'flex', justifyContent: 'center' }}>
          {data?.user?.phoneNumber && (
            <div
              style={matches ? { display: 'flex', justifyContent: 'center' } : { display: 'flex' }}
            >
              <PhoneIcon
                style={{
                  heigth: '5.6px',
                  width: '13.6px',
                  verticalAlign: 'middle',
                  marginRight: '14px'
                }}
              />
              <Typography data-testid="phone" className={css(styles.info)}>
                {data.user.phoneNumber}
              </Typography>
            </div>
          )}
          {!matches && data?.user?.email && (
            <Divider
              orientation="vertical"
              flexItem
              style={{ height: '8px', margin: '8px 10px 0 10px' }}
            />
          )}
          {data?.user?.email && (
            <div
              style={matches ? { display: 'flex', justifyContent: 'center' } : { display: 'flex' }}
            >
              <EmailIcon
                style={{
                  heigth: '5.6px',
                  width: '13.6px',
                  verticalAlign: 'middle',
                  marginRight: '14px'
                }}
              />
              <Typography data-testid="email" className={css(styles.info)}>
                {data?.user.email}
              </Typography>
            </div>
          )}
          {!matches && data?.user?.address && (
            <Divider
              orientation="vertical"
              flexItem
              style={{ height: '8px', margin: '8px 10px 0 10px' }}
            />
          )}
          {data?.user?.address && (
            <div
              style={matches ? { display: 'flex', justifyContent: 'center' } : { display: 'flex' }}
            >
              <LocationOnIcon
                style={{
                  heigth: '5.6px',
                  width: '13.6px',
                  verticalAlign: 'middle',
                  marginRight: '14px'
                }}
              />
              <Typography data-testid="address" className={css(styles.info)}>
                {data?.user.address}
              </Typography>
            </div>
          )}
        </div>
        {userType === 'security_guard' && authState.user.community.name !== 'Ciudad Morazán' && (
          <div
            className="container row d-flex justify-content-between"
            style={matches ? {} : { marginLeft: '80px' }}
          >
            <CaptureTemp refId={data?.user.id} refName={data?.user.name} refType="Users::User" />
          </div>
        )}
        {['admin'].includes(userType) && <UserLabels userId={data.user.id} />}
      </div>
    </>
  );
}

UserDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  userType: PropTypes.string.isRequired
};

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
});
