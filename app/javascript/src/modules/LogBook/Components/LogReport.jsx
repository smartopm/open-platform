import React from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import PageWrapper from '../../../shared/PageWrapper';
import LogbookStats from './LogbookStats';
import GateFlowReport from './GateFlowReport';
import AccessCheck from '../../Permissions/Components/AccessCheck';

export default function LogReport() {
  const { t } = useTranslation('common');
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <PageWrapper pageTitle={t('common:menu.report')}>
      <Grid container spacing={2}>
        <Grid
          item
          lg={5}
          md={5}
          sm={12}
          xs={12}
          style={matches ? {margin: '8% 20px 0 20px'} : { margin: '5% 7% 0 2%' }}
          className={classes.container}
        >
          <LogbookStats />
        </Grid>
        <Grid item lg={5} md={5} sm={12} xs={12} className={classes.container} style={matches ? {margin: '20px'} : {marginTop: '5%'}}>
          <AccessCheck
            module="event_log"
            allowedPermissions={['can_download_logbook_events']}
            show404ForUnauthorized={false}
          >
            <GateFlowReport />
          </AccessCheck>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: '20px',
    border: `1px solid ${theme.palette.primary.main}`,
    width: '90%',
    borderRadius: '8px',
  },
}));
