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

export default function Report() {
  const classes = useStyles();
  const authState = useContext(Context);
  const [printOpen, setPrintIsOpen] = useState(false);
  const [reportingDate, setReportingDate] = useState({ startDate: null, endDate: null });
  const [rangerPickerOpen, setRangePickerOpen] = useState(true);
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
  }, [called, loading, error]);

  function printReport() {
    document.title = `Customs-Report-${new Date().toISOString()}`;
    window.print();
  }

  function handleCloseReport() {
    setPrintIsOpen(false);
    history.push('/reports');
  }

  function generateReport() {
    loadReportData();
  }
  const formattedData = groupBy(data?.formSubmissions, 'fieldName');

  return (
    <>
      <DetailsDialog
        handleClose={handleCloseReport}
        open={rangerPickerOpen}
        title="Pick reporting date range"
        color="default"
      >
        <Container>
          <Grid container direction="row" spacing={4}>
            <Grid item>
              <DatePickerDialog
                selectedDate={reportingDate.startDate}
                handleDateChange={date => setReportingDate({ ...reportingDate, startDate: date })}
                label="Pick Report Start Date"
              />
            </Grid>
            <Grid item>
              <DatePickerDialog
                selectedDate={reportingDate.endDate}
                handleDateChange={date => setReportingDate({ ...reportingDate, endDate: date })}
                label="Pick Report End Date"
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
              Generate Report
            </Button>
          </CenteredContent>
          <br />
          <Typography component="span" color="secondary">
            {error ? formatError(error.message) : null}
          </Typography>
        </Container>
      </DetailsDialog>
      <FullScreenDialog
        open={!rangerPickerOpen && called && printOpen}
        handleClose={handleCloseReport}
        title="Customs-Report"
        actionText="Print"
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
            <Typography className={classes.reportTitle}>Log of hours of service of sub-administrator in customs post</Typography>
          </CenteredContent>
          <div style={{ marginTop: 50 }}>
            <ReportHeader reportingDate={reportingDate} />
            <ReportData formattedData={formattedData} />
            <ReportFooter />
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
