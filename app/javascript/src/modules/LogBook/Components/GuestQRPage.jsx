import React, { useContext } from 'react';
import { QRCode } from 'react-qr-svg';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-apollo';
import { Redirect } from "react-router-dom";
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { EntryRequestQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';

function qrCodeAddress(reqId) {
  return `${window.location.protocol}//${window.location.hostname}/request/${reqId}`
}

export default function GuestQRPage({ match }){
  const { id } = match.params;
  const authState = useContext(Context);
  const { loading, error, data } = useQuery(EntryRequestQuery, {
    variables: { id },
    errorPolicy: 'all'
  })
  if (loading) return <Spinner />
  if(error) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  if(data?.result?.guestId !== authState.user.id) return <Redirect push to="/" />;

  return (
    <GuestQRCode data={authState} requestId={id} />
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
              <h5>
                {t('guest.qr_code')}
              </h5>
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


GuestQRPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string })
  }).isRequired
}

GuestQRCode.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({ name: PropTypes.string })
  }).isRequired,
  requestId: PropTypes.string.isRequired
}