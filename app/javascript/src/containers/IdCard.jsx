import React, { useContext } from 'react'
import { useQuery } from 'react-apollo'
import { QRCode } from 'react-qr-svg'
import Loading from '../components/Loading.jsx'
import DateUtil from '../utils/dateutil.js'
import { UserQuery } from '../graphql/queries'
import { Context } from './Provider/AuthStateProvider'
import Nav from '../components/Nav.jsx'
import ErrorPage from '../components/Error.jsx'
import { isTimeValid } from './Requests/RequestUpdate.jsx'

function qrCodeAddress(id_card_token) {
  const timestamp = Date.now()
  return `${window.location.protocol}//${window.location.hostname}/user/${id_card_token}/${timestamp}/dg`
}

export default () => {
  const authState = useContext(Context)
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id: authState.user.id }
  })
  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return <Component data={data} />
}

export function Component({ data }) {
  const date = new Date()

  return (
    <div>
      <Nav navName="Identity" menuButton="back" />
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
              Expiration: {DateUtil.isExpired(data.user.expiresAt) ? <span className='text-danger'>Already Expired</span> : DateUtil.formatDate(data.user.expiresAt)}
            </div>
          </div>
          <br />
          <br />

          <div className="d-flex justify-content-center qr_code">
            <QRCode
              style={{ width: 256 }}
              value={qrCodeAddress(data.user.id)}
            />
          </div>
          {/* check the time and advise the user */}
          <br />
          <br />
          {
            !isTimeValid(date) && (
              <div className='d-flex justify-content-center'>
                <p>
                  <u>Visiting Hours</u> <br />
                  Monday - Friday: <b>8:00 - 16:00</b> <br />
                  Saturday: <b>8:00 - 12:00</b> <br />
                  Sunday: <b>Off</b> <br />
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div >
  )
}
