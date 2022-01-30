import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Card from '../../../shared/Card';

export default function CampaignStatCard({ data }) {
  const classes = useStyles();
  return (
    <Grid container className={classes.container}>
      <Grid item sm={4} className={classes.card}>
        <Card
          styles={{ padding: '20px 0', borderRadius: '5px', color: 'white' }}
          contentStyles={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
          className={classes.cardBackgroundPrimary}
        >
          <Typography variant="body2">Total Scheduled</Typography>
          <Typography variant="h4">{data.totalScheduled}</Typography>
        </Card>
      </Grid>
      <Grid sm={4} className={classes.card}>
        <Card
          styles={{ padding: '20px 0', borderRadius: '5px', color: 'white' }}
          contentStyles={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
          className={classes.cardBackgroundSecondary}
        >
          <Typography variant="body2">Total Sent</Typography>
          <Typography variant="h4">{data.totalSent}</Typography>
        </Card>
      </Grid>
      <Grid sm={4}>
        <Card
          styles={{ padding: '20px 0', borderRadius: '5px', color: 'white' }}
          contentStyles={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
          className={classes.cardBackgroundPrimary}
        >
          <Typography variant="body2">Click Rate</Typography>
          <Typography variant="h4">{data.totalClicked}</Typography>
        </Card>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
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
