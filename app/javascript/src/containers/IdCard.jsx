/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'
import { QRCode } from 'react-qr-svg'
import { Typography } from '@material-ui/core'
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined'
import Loading from '../shared/Loading'
import DateUtil from '../utils/dateutil'
import { UserQuery } from '../graphql/queries'
import { Context } from './Provider/AuthStateProvider'
import ErrorPage from '../components/Error'

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
    <UserIDDetail data={data} />
  )
}

export function UserIDDetail({ data }) {
  return (
    <div>
     
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
              Expiration:
              {' '}
              {DateUtil.isExpired(data.user.expiresAt) ? (
                <span className="text-danger">Already Expired</span>
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
                This &quot;QR Code&quot; is a unique identifier for you Nkwashi
                account and can be used at the main gate instead of writing your
                contact information manually. Our goal is to provide fast, easy
                and secure access.
              </Typography>
            </div>
          </div>

          {/* check the time and advise the user */}
          <div className="d-flex justify-content-center">
            <p>
              <u>Please note the main gate visiting hours:</u> 
              {' '}
              <br />
              <br />
              <span data-testid="visiting_hours">
                {' '}
                Monday - Friday:
                <b>8:00 - 16:00</b> 
                {' '}
                <br />
                Saturday: 
                {' '}
                <b>8:00 - 12:00</b> 
                {' '}
                <br />
                Sunday: 
                {' '}
                <b>Off</b> 
                {' '}
                <br />
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
