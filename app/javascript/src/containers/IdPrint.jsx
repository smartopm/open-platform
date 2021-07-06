/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'
import { QRCode } from 'react-qr-svg'
import Loading from '../shared/Loading'
import DateUtil from '../utils/dateutil'

import { UserQuery } from '../graphql/queries'
import ErrorPage from '../components/Error'
import CommunityName from '../shared/CommunityName'
import { Context } from './Provider/AuthStateProvider'

function expiresAtStr(datetime) {
  if (datetime) {
    const date = DateUtil.fromISO8601(datetime)
    return (
      `${date.getFullYear()  }-${  date.getMonth() + 1  }-${  date.getDate()}`
    )
  }
  return 'Never'
}

function qrCodeAddress(userId) {
  const timestamp = Date.now()
  const linkUrl = `${window.location.protocol}//${window.location.hostname}/user/${userId}/${timestamp}`
  return linkUrl
}


export default function IdPrintPage({ match }){
  const {id} = match.params
  const { loading, error, data } = useQuery(UserQuery, { variables: { id } })

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return <UserPrintDetail data={data} />
}

function toTitleCase(str) {
// eslint-disable-next-line
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export function UserPrintDetail({ data }) {
  const authState = useContext(Context)
  return (
    <div>
      <div className="row justify-content-center">
        <div
          id="idCard"
          className="card id_card_box"
          style={{ width: '325px' }}
        >
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: '1.75em' }}
          >
            <CommunityName authState={authState} />
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: '1.5em' }}
          >
            <div className="member_type">{toTitleCase(data.user.userType)}</div>
          </div>
          <div className="d-flex justify-content-center">
            <h1 style={{ fontWeight: '800' }}>{data.user.name}</h1>
          </div>
          <div className="d-flex justify-content-center">
            <div className="expires">
              Exp:
              {' '}
              {expiresAtStr(data.user.expiresAt)}
            </div>
          </div>

          <div className="d-flex justify-content-center qr_code">
            <QRCode
              style={{ width: 256 }}
              value={qrCodeAddress(data.user.id)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
