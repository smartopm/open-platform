/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import { QRCode } from 'react-qr-svg'
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import domtoimage from 'dom-to-image';
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
  const authState = useContext(Context);
  const { t } = useTranslation('common');
  const [downloading, setDownloading] = useState(false);

  function downloadId() {
    setDownloading(true);
    const node = document.getElementById('idCard');
    domtoimage.toPng(node)
      .then(function (dataUrl) {
          const a = document.createElement('a');
          a.setAttribute('href', dataUrl);
          a.setAttribute('download', 'ID.png');
          a.innerHTML = 'Download';
          a.click();
          setDownloading(false);
      })
      .catch(function (error) {
          console.error('ID download error', error);
          setDownloading(false);
      });
  }

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
          <div>
            <h1 style={{ fontWeight: '800' }}>{data.user.name}</h1>
          </div>
          <div>
            <div>
              {t('misc.role')}
              :
              {' '}
              {toTitleCase(data.user.userType)}
            </div>
          </div>
          <div>
            <div className="expires" style={{marginBottom: '5px'}}>
              {t('misc.exp')}
              :
              {' '}
              {expiresAtStr(data.user.expiresAt)}
            </div>
          </div>
          <div>
            <QRCode
              style={{ width: 256 }}
              value={qrCodeAddress(data.user.id)}
            />
          </div>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '5px'}}>
        <Button
          onClick={downloadId}
          color='primary'
          variant='contained'
          disabled={downloading}
          data-testid="download_button"
        >
          {t('misc.download_id')}
        </Button>
      </div>
    </div>
  )
}
