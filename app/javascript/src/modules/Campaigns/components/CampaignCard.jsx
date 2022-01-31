import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
        <Grid container spacing={5} justifyContent="center" alignItems="center">
          <Grid item md={2} xs={3}>
            <Typography variant="caption" color="textSecondary" component="span">
              {camp.batchTime ? dateToString(camp.batchTime) : 'Never '}
            </Typography>
          </Grid>
          <Grid item md={8} xs={6}>
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
          <Grid item md={2} xs={3} style={{ textAlign: 'right' }}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="campaign-item-menu"
              dataid={camp.id}
              onClick={event => menuData.handleMenu(event, camp)}
              color="primary"
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
