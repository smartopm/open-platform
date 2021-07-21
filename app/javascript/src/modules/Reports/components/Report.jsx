/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
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
import { dateToString, formatIfDate } from '../../../components/DateContainer';
import DatePickerDialog from '../../../components/DatePickerDialog';

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

  let highestRecords = 1;
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
          <div style={{ marginTop: '50px' }}>
            <Grid container>
              <Grid item xs={6}>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={classes.title}>
                    <b>
                      Customs post
                    </b>
                  </Grid>
                  <Grid item xs={8} data-testid="client-name" className={classes.title}>
                    ZEDE Moraźan - 9100
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} className={classes.title}>
                    <b>Sub-Administrator</b>
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
            <div className="plan-header" style={{ marginTop: 60 }}>
              <Grid container spacing={5}>
                {Object.keys(formattedData).map(header => {
                    if (formattedData[String(header)].length > highestRecords)
                      highestRecords = formattedData[String(header)].length;
                    return (
                      <Grid
                        item
                        xs
                        className={classes.title}
                        key={header}
                        style={{ fontWeight: 700, color: '#2D2D2D' }}
                      >
                        {header}
                      </Grid>
                    );
                  })}
              </Grid>
              <Divider className={classes.divider} />
              {Array.from(Array(highestRecords)).map((_val, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                <Grid key={i} container direction="row" spacing={2}>
                  {Object.keys(formattedData).map(head => (
                    <Grid item xs key={head}>
                      {formatIfDate(formattedData[String(head)][Number(i)]?.value) || '-'}
                    </Grid>
                    ))}
                </Grid>
                ))}
            </div>
            <Grid container>
              <Grid item xs={6}>
                <div style={{ marginTop: 80, textAlign: 'center' }}>
                  <hr className={classes.hr} />
                  <Grid container spacing={1}>
                    <Grid item xs className={classes.title}>
                      -
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs className={classes.title}>
                      Sub-Administrator
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs className={classes.title}>
                      Customs post 9100
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div style={{ marginTop: 80}}>
                  <hr className={classes.hr} />
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item className={classes.title}>
                      <b>Ciudad Moraźan</b>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item className={classes.title}>
                      Customs Administrator
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
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
  divider: {
    margin: '19px 0 27px 0'
  },
  reportTitle: {
    color: '#2D2D2D',
    fontSize: '20px',
    fontWeight: 700,
    marginTop: '69px'
  },
  hr: {
    width: '80%',
    height: 1,
    backgroundColor: '#000000'
  }
});
