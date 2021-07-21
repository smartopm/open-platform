import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../components/DateContainer';

export default function ReportHeader({ reportingDate }) {
    const { t } = useTranslation('report')
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={6}>
        <Grid container spacing={1}>
          <Grid item xs={4} className={classes.title}>
            <b>{t('misc.customs')}</b>
          </Grid>
          <Grid item xs={8} data-testid="client-name" className={classes.title}>
            ZEDE Moraźan - 9100
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={4} className={classes.title}>
            <b>{t('misc.sub_admin')}</b>
          </Grid>
          <Grid item xs={8} className={classes.title} data-testid="nrc">
            -
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={4} className={classes.title}>
            <b>Period</b>
          </Grid>
          <Grid item xs={8} className={classes.title}>
            {`${dateToString(reportingDate.startDate)} - ${dateToString(reportingDate.endDate)}`}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

ReportHeader.propTypes = {
  reportingDate: PropTypes.shape({
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date)
  }).isRequired
};

const useStyles = makeStyles({
  title: {
    fontWeight: 400,
    fontSize: '16px',
    color: '#656565'
  },
  reportTitle: {
    color: '#2D2D2D',
    fontSize: '20px',
    fontWeight: 700,
    marginTop: '69px'
  }
});
