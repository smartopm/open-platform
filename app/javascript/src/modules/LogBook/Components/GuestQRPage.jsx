/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';
import { QRCode } from 'react-qr-svg';
import { useTranslation } from 'react-i18next';
import { UserQuery } from '../../../graphql/queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';

function qrCodeAddress(id_card_token) {
  return `${window.location.protocol}//${window.location.hostname}/request/${id_card_token}`
}

export default function GuestQRPage({ match }){
  const { id } = match.params;
  const authState = useContext(Context)
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id: authState.user?.id },
    errorPolicy: 'all'
  })
  if (loading) return <Spinner />
  if(error) return <CenteredContent>{formatError(error.message)}</CenteredContent>

  return (
    <GuestQRCode data={data} requestId={id} />
  )
}

export function GuestQRCode({ data, requestId }) {
  const { t } = useTranslation('logbook');
  return (
    <div>
      <div className="row justify-content-center">
        <div className="card id_card_box col-6 col-sm-6 col-md-4" style={{height: '450px'}}>
          <div
            className="d-flex justify-content-center"
            style={{ marginBottom: '1em' }}
          >
            <div className="member_type">
              <h3>
                {t('guest.qr_code')}
              </h3>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <h1>
              <strong>{data.user.name}</strong>
            </h1>
          </div>
          <br />
          <div className="d-flex justify-content-center qr_code">
            <QRCode
              style={{ width: 256 }}
              value={qrCodeAddress(requestId)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
