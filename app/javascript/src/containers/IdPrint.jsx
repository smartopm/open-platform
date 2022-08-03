/* eslint-disable react/prop-types */
import React, { useContext, useState, useRef, useCallback } from 'react';
import { useQuery } from 'react-apollo';
import { QRCode } from 'react-qr-svg';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toPng } from 'html-to-image';
import Loading, { Spinner } from '../shared/Loading';
import { UserQuery } from '../graphql/queries';
import ErrorPage from '../components/Error';
import CommunityName from '../shared/CommunityName';
import { Context } from './Provider/AuthStateProvider';
import CenteredContent from '../shared/CenteredContent';
import PageWrapper from '../shared/PageWrapper'

export function qrCodeAddress(userId) {
  const timestamp = Date.now();
  const linkUrl = `${window.location.protocol}//${window.location.hostname}/user/${userId}/${timestamp}`;
  return linkUrl;
}

export default function IdPrintPage({ match }) {
  const { id } = match.params;
  const { loading, error, data } = useQuery(UserQuery, { variables: { id } });

  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  return <UserPrintDetail data={data} />;
}

export function UserPrintDetail({ data }) {
  const authState = useContext(Context);
  const { t } = useTranslation('common');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null)
  const ref = useRef(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    setDownloading(true);
    toPng(ref.current)
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'my_id.png';
        link.href = dataUrl;
        link.click();
        setDownloading(false);
      })
      .catch(() => {
        setError(t('errors.something_wrong_qr_code'))
        setDownloading(false);
      });
  }, [ref]);

  return (
    <PageWrapper>
      <div className="row justify-content-center">
        <div id="idCard" className="card id_card_box" style={{ width: '325px' }} ref={ref}>
          <CenteredContent>
            <CommunityName authState={authState} />
          </CenteredContent>
          <div style={{ display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
            <Typography component="h1">{data.user.name}</Typography>
          </div>
          <br />
          <QRCode style={{ width: 256 }} value={qrCodeAddress(data.user.id)} />
        </div>
      </div>
      <br />
      <CenteredContent>
        <Button
          onClick={onButtonClick}
          color="primary"
          variant="contained"
          disabled={downloading}
          data-testid="download_button"
          startIcon={downloading && <Spinner />}
        >
          {t('misc.download_id')}
        </Button>
      </CenteredContent>
      <CenteredContent>
        <Typography data-testid="error" color="error">{error}</Typography>
      </CenteredContent>
    </PageWrapper>
  );
}
