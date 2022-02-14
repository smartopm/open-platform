import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Card from '../../../shared/Card';

export default function CampaignStatCard({ data }) {
  const classes = useStyles();
  const { t } = useTranslation('campaign');
  return (
    <Grid container className={classes.container}>
      <Grid item lg={4} md={4} sm={4} xs={4} className={classes.card} data-testid="total-scheduled">
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
      <Grid lg={4} md={4} sm={4} xs={4} className={classes.card} data-testid="total-sent">
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
      <Grid lg={4} md={4} sm={4} xs={4} data-testid="click-rate">
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
    totalClicked: PropTypes.number
  }).isRequired
};
