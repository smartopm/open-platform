import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function ReportFooter({ subAdministrator }) {
  const { t } = useTranslation('report');
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={6}>
        <div style={{ marginTop: 100, textAlign: 'center' }}>
          <hr className={classes.hr} />
          <Grid container spacing={1}>
            <Grid item xs className={classes.title}>
              <b>{subAdministrator}</b>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs className={classes.title}>
              {t('misc.sub_admin')}
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs className={classes.title}>
              {t('misc.customs_post')}
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div style={{ marginTop: 100 }}>
          <hr className={classes.hr} />
          <Grid container direction="column" alignItems="center" spacing={1}>
            <Grid item className={classes.title}>
              <b>Ciudad Moraźan</b>
            </Grid>
          </Grid>
          <Grid container direction="column" alignItems="center" spacing={1}>
            <Grid item className={classes.title}>
              {t('misc.customs_admin')}
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}

ReportFooter.defaultProps = {
  subAdministrator: '-'
};
ReportFooter.propTypes = {
  subAdministrator: PropTypes.string
};

const useStyles = makeStyles({
  title: {
    fontWeight: 400,
    fontSize: '16px',
    color: '#656565'
  },
  hr: {
    width: '70%',
    height: 1,
    backgroundColor: '#000000'
  }
});
