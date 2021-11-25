/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import { QRCode } from 'react-qr-svg'
import { Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import domtoimage from 'dom-to-image';
import Loading from '../shared/Loading'
import { UserQuery } from '../graphql/queries'
import ErrorPage from '../components/Error'
import CommunityName from '../shared/CommunityName'
import { Context } from './Provider/AuthStateProvider'
import CenteredContent from '../shared/CenteredContent';


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
          <CenteredContent>
            <CommunityName authState={authState} />
          </CenteredContent>
          <CenteredContent>
            <Typography component="h1">{data.user.name}</Typography>
          </CenteredContent>
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
