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
import {Typography } from '@material-ui/core'
import Avatar from '../components/Avatar.jsx'

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
            className="d-flex "
            style={{ marginBottom: '1em' }}
          >
          
            <div className="row" style={{width: 280, marginLeft: "8%"}}>
             
                <div className="col-4 ">
                <Avatar user={data.user} style="medium" />
                </div>

                <div className="col-8 p-50">
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      style={{ fontWeight: "bold"}}
                    >
                      {data.user.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {data.user.userType}
                    </Typography>
                    <Typography variant="body2">
                      Expiration: {DateUtil.isExpired(data.user.expiresAt) ? <span className='text-danger'>Already Expired</span> : DateUtil.formatDate(data.user.expiresAt)}
                    </Typography>
               </div>
              
            </div>

          </div>
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
