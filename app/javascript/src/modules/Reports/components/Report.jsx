/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import groupBy from 'lodash/groupBy';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { FullScreenDialog } from '../../../components/Dialog';
import CenteredContent from '../../../components/CenteredContent';
import FormSubmissionsQuery from '../graphql/report_queries';
import Loading from '../../../shared/Loading';
import { formatError } from '../../../utils/helpers';
import { formatIfDate } from '../../../components/DateContainer';


export default function Report() {
  const classes = useStyles();
  const authState = useContext(Context);
  const [printOpen, setPrintIsOpen] = useState(true);
  const history = useHistory();
  const { data, error, loading } = useQuery(FormSubmissionsQuery, {
    variables: { formId: '1c039ab4-fb74-469e-a743-00cfc60033ef' }, // replace this ID
    fetchPolicy: 'cache-and-network'
  });

  function printReport() {
    document.title = `Customs-Report-${new Date().toISOString()}`;
    window.print();
  }

  function handleCloseReport() {
    setPrintIsOpen(!printOpen);
    history.push('/customs_report');
  }

  if (loading) return <Loading />;
  if(error){
    return <CenteredContent>{formatError(error.message)}</CenteredContent>
  }
  const formattedData = groupBy(data?.formSubmissions, 'fieldName');

  let highestRecords = 1;
  return (
    <>
      <div>
        <FullScreenDialog
          open={printOpen}
          handleClose={handleCloseReport}
          title="Plan Customs-Report"
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
              <Typography className={classes.planTitle}>Customs Forms Report</Typography>
            </CenteredContent>
            <div style={{ marginTop: '50px' }}>
              <Grid container>
                <Grid item xs={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={classes.title}>
                      T1
                    </Grid>
                    <Grid item xs={8} data-testid="client-name" className={classes.title}>
                      TC1
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={classes.title}>
                      T2
                    </Grid>
                    <Grid item xs={8} className={classes.title} data-testid="nrc">
                      TC2
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={4} className={classes.title}>
                      T3
                    </Grid>
                    <Grid item xs={8} className={classes.title}>
                      TC3
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
                  {/* there should be a divider here */}
                  <Divider className={classes.divider} />
                  <div>
                    <hr />
                    <b style={{ fontSize: '16px' }}>D Title</b>
                    {' '}
                    <br />
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        D1
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        D2
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={3} className={classes.title}>
                        D3
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Divider className={classes.divider} />
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title} style={{ textAlign: 'right' }}>
                      AD1
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title} style={{ textAlign: 'right' }}>
                      AD2
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={8} className={classes.title} style={{ textAlign: 'right' }}>
                      AD3
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </FullScreenDialog>
      </div>
    </>
  );
}

const useStyles = makeStyles({
  container: {
    margin: '80px 284px'
  },
  title: {
    fontWeight: 400,
    fontSize: '16px',
    color: '#656565'
  },
  name: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#2D2D2D'
  },
  details: {
    display: 'flex',
    justifyContent: 'spaceBetween'
  },
  paymentInfo: {
    width: '500px'
  },
  divider: {
    margin: '19px 0 27px 0'
  },
  planTitle: {
    color: '#2D2D2D',
    fontSize: '20px',
    fontWeight: 700,
    marginTop: '69px'
  }
});
