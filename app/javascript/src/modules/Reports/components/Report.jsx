import React, { useContext, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { FullScreenDialog } from '../../../components/Dialog';
import CenteredContent from '../../../components/CenteredContent';

export default function Report() {
  const classes = useStyles();
  const authState = useContext(Context);
  const [printOpen, setPrintIsOpen] = useState(true);
  const history = useHistory();

  function printReport() {
    document.title = `Customs-Report-${new Date().toISOString()}`;
    window.print();
  }

  function handleCloseReport() {
    setPrintIsOpen(!printOpen);
    history.push('/customs_report');
  }

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
              <div className="plan-header" style={{ margin: '60px 0' }}>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={2}
                    className={classes.title}
                    key="receipt_number"
                    style={{ fontWeight: 700, color: '#2D2D2D' }}
                  >
                    Receipt Number
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={classes.title}
                    key="payment_date"
                    style={{ fontWeight: 700, color: '#2D2D2D' }}
                  >
                    Payment Date
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={classes.title}
                    key="amount_paid"
                    style={{ fontWeight: 700, color: '#2D2D2D' }}
                  >
                    Amount Paid
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={classes.title}
                    key="installment_amount"
                    style={{ fontWeight: 700, color: '#2D2D2D' }}
                  >
                    Installment Amount
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={classes.title}
                    key="number_of_installements"
                    style={{ fontWeight: 700, color: '#2D2D2D' }}
                  >
                    No. of Installments
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    className={classes.title}
                    key="debit"
                    style={{ fontWeight: 700, color: '#2D2D2D' }}
                  >
                    Debit
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    className={classes.title}
                    key="balance"
                    style={{ fontWeight: 700, color: '#2D2D2D' }}
                  >
                    Unallocated Balance
                  </Grid>
                </Grid>
                <Divider className={classes.divider} />
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
