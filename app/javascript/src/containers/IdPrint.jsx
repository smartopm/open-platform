import React from 'react'
import { useQuery } from 'react-apollo'
import Loading from '../components/Loading.jsx'
import Logo from '../../../assets/images/nkwashi_logo_black_transparent.png'

import html2canvas from 'html2canvas'

import DateUtil from '../utils/dateutil.js'

import { UserQuery } from '../graphql/queries'
import ErrorPage from '../components/Error.jsx'
import { QRCode } from 'react-qr-svg'

function expiresAtStr(datetime) {
  if (datetime) {
    const date = DateUtil.fromISO8601(datetime)
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    )
  }
  return 'Never'
}

function qrCodeAddress(id_card_token) {
  const linkUrl =
    window.location.protocol +
    '//' +
    window.location.hostname +
    '/user/' +
    id_card_token
  return linkUrl
}

function openImageInNewTab() {
  html2canvas(document.getElementById('idCard'), { allowTaint: true }).then(
    function(canvas) {
      let d = canvas.toDataURL('image/png')
      let w = window.open('about:blank')
      let image = new Image()
      image.src = d
      setTimeout(function() {
        w.document.write(image.outerHTML)
      }, 0)
    }
  )
}

export default ({ match }) => {
  let id = match.params.id
  const { loading, error, data } = useQuery(UserQuery, { variables: { id } })

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return <Component data={data} />
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

function downloadBtn() {
  html2canvas(document.getElementById('idCard'), { allowTaint: true }).then(
    function(canvas) {
      let dt = canvas.toDataURL('image/png')
      /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
      let dlDt = dt.replace(
        /^data:image\/[^;]*/,
        'data:application/octet-stream'
      )

      /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
      dlDt = dlDt.replace(
        /^data:application\/octet-stream/,
        'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png'
      )
      const a = document.createElement('a')
      a.setAttribute('download', 'Canvas.png')
      a.setAttribute('href', dlDt)
      a.innerHTML = 'Download'
      document.body.appendChild(a)
    }
  )
}

export function Component({ data }) {
  return (
    <div>
      <div className="row justify-content-center">
        <div
          id="idCard"
          className="card id_card_box"
          style={{ width: '325px' }}
          onClick={openImageInNewTab}
        >
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: '1.75em' }}
          >
            <img src={Logo} style={{ width: '200px' }} onLoad={downloadBtn} />
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
              Exp: {expiresAtStr(data.user.expiresAt)}
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
