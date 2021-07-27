/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useLazyQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import Container from '@material-ui/core/Container';
import groupBy from 'lodash/groupBy';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { DetailsDialog, FullScreenDialog } from '../../../components/Dialog';
import CenteredContent from '../../../components/CenteredContent';
import FormSubmissionsQuery from '../graphql/report_queries';
import { Spinner } from '../../../shared/Loading';
import { formatError } from '../../../utils/helpers';
import DatePickerDialog from '../../../components/DatePickerDialog';
import ReportFooter from './ReportFooter'
import ReportData from './ReportData';
import ReportHeader from './ReportHeader';
import MessageAlert from '../../../components/MessageAlert';

export default function Report() {
  const classes = useStyles();
  const authState = useContext(Context);
  const [printOpen, setPrintIsOpen] = useState(false);
  const [reportingDate, setReportingDate] = useState({ startDate: null, endDate: null });
  const [rangerPickerOpen, setRangePickerOpen] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false)
  const { t } = useTranslation('report')
  const history = useHistory();
  const [loadReportData, { data, error, loading, called }] = useLazyQuery(FormSubmissionsQuery, {
    variables: {
      startDate: reportingDate.startDate,
      endDate: reportingDate.endDate
    },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (called && !loading && !error) {
      setRangePickerOpen(false);
      setPrintIsOpen(true);
    }
    if (called && !loading && error) {
      setAlertOpen(!alertOpen)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [called, loading, error]);

  function printReport() {
    document.title = `${t('misc.report_title')}-${new Date().toISOString()}`;
    window.print();
  }

  function handleCloseReport() {
    setPrintIsOpen(false);
    history.push('/reports');
  }

  function generateReport() {
    loadReportData();
  }


  const sortedData = data?.formSubmissions.sort((a, b) => a.order - b.order) || []
  const filteredData = sortedData.filter(submission => submission.fieldType !== 'file_upload')
  const formattedData = groupBy(filteredData, 'fieldName');

  return (
    <>
      <MessageAlert
        type='error'
        message={formatError(error?.message)}
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
      />
      <DetailsDialog
        handleClose={handleCloseReport}
        open={rangerPickerOpen}
        title={t('misc.pick_reporting_range')}
        color="default"
      >
        <Container>
          <Grid container direction="row" spacing={4}>
            <Grid item>
              <DatePickerDialog
                selectedDate={reportingDate.startDate}
                handleDateChange={date => setReportingDate({ ...reportingDate, startDate: date })}
                label={t('misc.pick_start_date')}
              />
            </Grid>
            <Grid item>
              <DatePickerDialog
                selectedDate={reportingDate.endDate}
                handleDateChange={date => setReportingDate({ ...reportingDate, endDate: date })}
                label={t('misc.pick_end_date')}
              />
            </Grid>
          </Grid>
          <br />
          <CenteredContent>
            <Button
              variant="outlined"
              color="primary"
              onClick={generateReport}
              disabled={loading || !reportingDate.startDate || !!error?.message}
              startIcon={loading && <Spinner />}
            >
              {t('misc.generate_report')}
            </Button>
          </CenteredContent>
        </Container>
      </DetailsDialog>
      <FullScreenDialog
        open={!rangerPickerOpen && called && printOpen}
        handleClose={handleCloseReport}
        title={t('misc.report_title')}
        actionText={t('misc.print_report')}
        handleSubmit={printReport}
      >
        <div className="print" style={{ margin: '57px 155px' }}>
          {/* Find out why we aren't using the CommunityName component for this */}
          {authState.user.community?.logoUrl ? (
            <img
              src={authState.user.community?.logoUrl}
              alt="community-logo"
              height="80"
              width="150"
              style={{ margin: '30px auto', display: 'block' }}
            />
            ) : (
              <h3 style={{ textAlign: 'center', marginTop: '15px' }}>
                {authState.community?.name}
              </h3>
            )}
          <CenteredContent>
            <Typography className={classes.reportTitle}>{t('misc.report_header_text')}</Typography>
          </CenteredContent>
          <div style={{ marginTop: 50 }}>
            <ReportHeader reportingDate={reportingDate} subAdministrator={authState.user.community.subAdministrator} />
            <ReportData formattedData={formattedData} />
            <ReportFooter subAdministrator={authState.user.community.subAdministrator} />
          </div>
        </div>
      </FullScreenDialog>
    </>
  );
}

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
  },
});
