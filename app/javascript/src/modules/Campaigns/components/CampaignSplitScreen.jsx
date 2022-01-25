import React from 'react'
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CenteredContent from '../../../shared/CenteredContent';
import CampaignSplitScreenContent from './CampaignSplitScreenContent';

export default function CampaignSplitScreen({ campaignLength }) {
  const classes = useStyles();
  return (
    <div>
      {campaignLength === 0 && (
        <CenteredContent>
          <div className={classes.noCampaigns}>
            <Typography variant='body1' color='textSecondary'>No Campaigns have been created yet.</Typography>
            <Button className={classes.createCampaign} variant='contained' color='primary'>Create Campaign</Button>
          </div>
        </CenteredContent>
      )}
      <CampaignSplitScreenContent />
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