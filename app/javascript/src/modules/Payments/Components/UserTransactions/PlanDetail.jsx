import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { DetailsDialog } from '../../../../components/Dialog'

export default function PlanDetail({ open, handleModalClose, planData }) {
  const classes = useStyles();
  return (
    <>
      {console.log(planData)}
      <DetailsDialog
        open={open}
        handleClose={handleModalClose}
        title='Plan Details'
      >
        <div className={classes.detailBody}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography color='primary' className={classes.name}>{planData?.user?.name}</Typography> 
            </Grid>
            <Grid item xs={6}>
              {' '} 
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.details}>Details</Typography> 
            </Grid>
            <Grid item xs={6} style={{textAlign: 'right'}}>
              <KeyboardArrowDownIcon /> 
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>StartDate</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData.startDate} 
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Plan Duration</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {`${planData.durationInMonth} months`}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Status</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData.status}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Plan Type</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData.planType}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Amount</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData.monthlyAmount}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Plot</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData?.landParcel?.parcelNumber}
            </Grid>
          </Grid>
        </div>
      </DetailsDialog>
    </>
  )
}

const useStyles = makeStyles(() => ({
  detailBody: {
    width: '520px',
    margin: '21px'
  },
  name: {
    fontSize: '20px',
    fontWeight: 500
  },
  details: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#141414'
  },
  fieldTitle: {
    color: '#8B8B8B',
    fontSize: '15px',
    fontWeight: 600
  },
  fieldContent: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#212121',
    textAlign: 'right'
  },
  divider: {
    margin: '20px 0'
  }
 }))