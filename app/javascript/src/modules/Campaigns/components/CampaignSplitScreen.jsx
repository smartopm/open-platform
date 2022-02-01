import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import { useLocation, useHistory } from 'react-router-dom';
import CenteredContent from '../../../shared/CenteredContent';
import CampaignSplitScreenContent from './CampaignSplitScreenContent';
import { Campaign } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import CampaignInfo from './CampaignInfo';

export default function CampaignSplitScreen({ campaignId, campaignLength, refetch, setShow }) {
  const location = useLocation();
  const history = useHistory();
  const path = location.pathname;
  const campaignPath = path === '/campaigns' || path === '/campaigns/';
  const [loadCampaign, { data, error, loading }] = useLazyQuery(Campaign, {
    variables: { id: campaignId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function campaignRoute() {
    history.push('/campaign-create');
    // setShow(false);
  }

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  if (loading) return <Spinner />;

  return (
    <div>
      {error && !data?.length && <CenteredContent>{error}</CenteredContent>}
      {campaignPath && campaignLength === 0 && (
        <CampaignInfo
          title="No campaigns has been created yet."
          buttonText="Create Campaign"
          handleClick={campaignRoute}
        />
      )}
      {campaignPath && campaignLength > 0 && (
        <CampaignInfo
          title="Select a campaign to edit or create a new one."
          buttonText="Create Campaign"
          handleClick={campaignRoute}
        />
      )}
      {(path === '/campaign-create' || campaignId) && (
        <CampaignSplitScreenContent
          refetch={refetch}
          campaign={data?.campaign}
          handleClose={setShow}
        />
      )}
    </div>
  );
}

CampaignSplitScreen.defaultProps = {
  campaignId: null
};

CampaignSplitScreen.propTypes = {
  campaignId: PropTypes.string,
  campaignLength: PropTypes.number.isRequired,
  refetch: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired
};
