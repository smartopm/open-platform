import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '../../../shared/Card';
import { dateToString } from '../../../components/DateContainer';

export default function CampaignCard({ camp, menuData, handleClick }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');
  return (
    <>
      <Card
        clickData={{ clickable: true, handleClick: () => handleClick(camp) }}
        styles={{ marginBottom: '10px' }}
        contentStyles={{ padding: '4px 4px 4px 10px' }}
      >
        <Grid container className={classes.container}>
          <Grid item lg={3} md={3} sm={3} xs={3}>
            <Typography variant="caption" color="textSecondary" component="span" data-testid='batch-time'>
              {camp.batchTime ? dateToString(camp.batchTime) : 'Never '}
            </Typography>
          </Grid>
          <Grid item lg={7} md={6} sm={6} xs={6} data-testid='name'>
            <Typography
              variant="body2"
              data-testid="campaign_name"
              component="p"
              color="textSecondary"
              className={matches ? classes.campaignBodyMobile : classes.campaignBody}
            >
              {camp.name}
            </Typography>
          </Grid>
          <Grid item lg={2} md={3} sm={3} xs={3} style={{ textAlign: 'right' }}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="campaign-item-menu"
              dataid={camp.id}
              onClick={event => menuData.handleMenu(event, camp)}
              color="primary"
              size="large"
            >
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Card>
    </>
);
}

const useStyles = makeStyles(() => ({
  campaignBody: {
    maxWidth: '42ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  },
  campaignBodyMobile: {
    maxWidth: '17ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  },
  container: {
    justifyContent: "center", 
    alignItems: "center"
  }
}));

CampaignCard.propTypes = {
  camp: PropTypes.shape({
    batchTime: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string
  }).isRequired,
  menuData: PropTypes.shape({
    handleMenu: PropTypes.func
  }).isRequired,
  handleClick: PropTypes.func.isRequired
};
