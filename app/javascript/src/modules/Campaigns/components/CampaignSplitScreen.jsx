import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/styles';
import { useLazyQuery } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CenteredContent from '../../../shared/CenteredContent';
import CampaignSplitScreenContent from './CampaignSplitScreenContent';
import { Campaign } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import { useParamsQuery } from '../../../utils/helpers';

export default function CampaignSplitScreen({ campaignLength, refetch }) {
  const classes = useStyles();
  const path = useParamsQuery();
  const campaignId = path.get('id');
  const [loadCampaign, { data, error, loading }] = useLazyQuery(Campaign, {
    variables: { id: campaignId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (campaignId) {
      loadCampaign()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId])

  if (loading) return <Spinner />;
  
  return (
    <div>
      {error && !data?.length && <CenteredContent>{error}</CenteredContent>}
      {campaignLength === 0 && (
        <CenteredContent>
          <div className={classes.noCampaigns}>
            <Typography variant='body1' color='textSecondary'>No Campaigns have been created yet.</Typography>
            <Button className={classes.createCampaign} variant='contained' color='primary'>Create Campaign</Button>
          </div>
        </CenteredContent>
      )}
      <CampaignSplitScreenContent refetch={refetch} campaign={data?.campaign} />
    </div>
  )
}

const useStyles = makeStyles(() => ({
  noCampaigns: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: '200px'
  },
  createCampaign: {
    marginTop: '20px',
    color: 'white'
  }
}));