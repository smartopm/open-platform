/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'
import { QRCode } from 'react-qr-svg'
import { Typography } from '@mui/material'
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined'
import { useTranslation } from 'react-i18next';
import Loading from '../shared/Loading'
import DateUtil from '../utils/dateutil'
import { UserQuery } from '../graphql/queries'
import { Context } from './Provider/AuthStateProvider'
import ErrorPage from '../components/Error'
import PageWrapper from '../shared/PageWrapper'

function qrCodeAddress(id_card_token) {
  const timestamp = Date.now()
  return `${window.location.protocol}//${window.location.hostname}/user/${id_card_token}/${timestamp}/dg`
}

export default function IdCardPage(){
  const authState = useContext(Context)
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id: authState.user?.id },
    errorPolicy: 'all'
  })
  if (loading) return <Loading />
  // if error is caused by permissions, move on.
  if (error && !error.message.includes('permission')) {
    return <ErrorPage title={error.message} />
  }
  return (
    <UserIDDetail data={data} communityName={authState.user.community.name} />
  )
}

export function UserIDDetail({ data, communityName }) {
  const { t } = useTranslation(['scan', 'days', 'common']);
  return (
    <PageWrapper PageTitle={t('misc.my_id')}>
      <div className="row justify-content-center">
        <div className="card id_card_box col-10 col-sm-10 col-md-6">
          <div
            className="d-flex justify-content-center"
            style={{ marginBottom: '1em' }}
          >
            <div className="member_type">{data.user.userType}</div>
          </div>
          <div className="d-flex justify-content-center">
            <h1>
              <strong>{data.user.name}</strong>
            </h1>
          </div>
          <div className="d-flex justify-content-center">
            <div className="expires">
              {t('common:misc.expiration')}
              :
              {' '}
              {DateUtil.isExpired(data.user.expiresAt) ? (
                <span className="text-danger">{t('common:misc.already_expired')}</span>
              ) : (
                DateUtil.formatDate(data.user.expiresAt)
              )}
            </div>
          </div>
          <br />

          <div className="d-flex justify-content-center qr_code">
            <QRCode
              style={{ width: 256 }}
              value={qrCodeAddress(data.user.id)}
            />
          </div>

          <br />

          <div
            className="row d-auto justify-content-center"
            style={{ alignItems: 'center' }}
          >
            <div
              className="d-flex justify-content-center col-2 p-0"
              style={{ width: 80 }}
            >
              <EmojiObjectsOutlinedIcon
                color="disabled"
                style={{ height: 40, width: 40, margin: 40 }}
              />
            </div>
            <div
              className="col-8 p-0 justify-content-center"
              style={{ width: 256, marginRight: '10%' }}
            >
              <Typography
                color="textSecondary"
                variant="body2"
                style={{ fontSize: 13 }}
              >
                {
                  communityName === 'Tilisi' ? t('qr_code.tilisi_message', {communityName}) : t('qr_code.message', {communityName})
                }
              </Typography>
            </div>
          </div>

          {/* check the time and advise the user */}
          {communityName && communityName !== 'Ciudad Morazán' && communityName !== 'Tilisi' ? (
            <div className="d-flex justify-content-center">
              <p>
                <u>{t('misc.visiting_hours')}</u>
                {' '}
                <br />
                <br />
                <span data-testid="visiting_hours">
                  {' '}
                  {t('days:days.monday')}
                  {' '}
                  -
                  {t('days:days.friday')}
                  :
                  {' '}
                  <b>8:00 - 16:00</b>
                  {' '}
                  <br />
                  {t('days:days.saturday')}
                  :
                  {' '}
                  <b>8:00 - 12:00</b>
                  {' '}
                  <br />
                  {t('days:days.sunday')}
                  :
                  {' '}
                  <b>{t('misc.off')}</b>
                  {' '}
                  <br />
                </span>
              </p>
            </div>
          )
            : null}
        </div>
      </div>
    </PageWrapper>
  )
}
