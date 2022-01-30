import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CenteredContent from '../../../shared/CenteredContent';

export default function CampaignInfo({ title, buttonText, handleClick }) {
  const classes = useStyles();
  return (
    <CenteredContent>
      <div className={classes.noCampaigns}>
        <Typography variant="body1" color="textSecondary">
          {title}
        </Typography>
        <Button
          className={classes.createCampaign}
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </div>
    </CenteredContent>
  );
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
