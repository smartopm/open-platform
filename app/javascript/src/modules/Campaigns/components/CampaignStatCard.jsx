import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Card from '../../../shared/Card';

export default function CampaignStatCard({ data }) {
  const classes = useStyles();
  const { t } = useTranslation('campaign');
  return (
    <Grid container className={classes.container}>
      <Grid item lg={3} md={3} sm={3} xs={3} className={classes.card} data-testid="total-scheduled">
        <Card
          styles={{ padding: '20px 0', borderRadius: '5px', color: 'white', height: '150px' }}
          contentStyles={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          className={classes.cardBackgroundPrimary}
        >
          <Typography variant="body2">{t('campaign.total_scheduled')}</Typography>
          <Typography variant="h4">{data.totalScheduled}</Typography>
        </Card>
      </Grid>
      <Grid item lg={3} md={3} sm={3} xs={3} className={classes.card} data-testid="total-sent">
        <Card
          styles={{ padding: '20px 0', borderRadius: '5px', color: 'white', height: '150px' }}
          contentStyles={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          className={classes.cardBackgroundSecondary}
        >
          <Typography variant="body2">{t('campaign.total_sent')}</Typography>
          <Typography variant="h4">{data.totalSent}</Typography>
        </Card>
      </Grid>
      <Grid item lg={3} md={3} sm={3} xs={3} className={classes.card} data-testid="open-rate">
        <Card
          styles={{ padding: '20px 0', borderRadius: '5px', color: 'white', height: '150px' }}
          contentStyles={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          className={classes.cardBackgroundPrimary}
        >
          <Typography variant="body2">{t('campaign.open_rate')}</Typography>
          <Typography variant="h4">{data.totalOpened}</Typography>
        </Card>
      </Grid>
      <Grid item lg={3} md={3} sm={3} xs={3} data-testid="click-rate">
        <Card
          styles={{ padding: '20px 0', borderRadius: '5px', color: 'white', height: '150px' }}
          contentStyles={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          className={classes.cardBackgroundSecondary}
        >
          <Typography variant="body2">{t('campaign.click_rate')}</Typography>
          <Typography variant="h4">{data.totalClicked}</Typography>
        </Card>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  card: {
    paddingRight: '10px'
  },
  cardBackgroundPrimary: {
    backgroundColor: theme.palette?.primary?.main
  },
  cardBackgroundSecondary: {
    backgroundColor: theme.palette?.secondary?.main
  },
  container: {
    marginBottom: '20px'
  }
}));

CampaignStatCard.propTypes = {
  data: PropTypes.shape({
    totalScheduled: PropTypes.number,
    totalSent: PropTypes.number,
    totalClicked: PropTypes.number,
    totalOpened: PropTypes.number
  }).isRequired
};
