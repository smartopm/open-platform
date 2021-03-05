import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardContent, CardHeader, Grid, Typography} from '@material-ui/core';
import { FullScreenDialog } from '../Dialog'

export default function LandParcelMergeModal({ open, mergeData, handleClose, handleSubmit }){
  return (
    <>
      {mergeData && (
        <FullScreenDialog
          open={open}
          handleClose={handleClose}
          title='Land Parcel Merge Dialog'
          actionText="Merge and Save"
          handleSubmit={handleSubmit}
        >
          <h3>You are about to merge these two properties!</h3>
          <br />
          <br />
          <Grid container spacing={1}>
            <Grid item xs={12} md={3} sm={3}>
              <b>Selected Property</b>
              <b> + </b>
              <b>Existing Property</b>
              {' ===> '}
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <b>After Merge (New Plot to Keep)</b>
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <b>After Merge (Plot to Remove)</b>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container spacing={1}>
            <Grid item xs={12} md={3} sm={3}>
              <ConfirmMergeCard title="Selected Property" data={mergeData?.selectedPlot} />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <ConfirmMergeCard title="Existing  Property" data={mergeData?.existingPlot} />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <ConfirmMergeCard title="After Merge (Plot to Keep)" data={mergeData?.plotToMerge} />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <ConfirmMergeCard title="After Merge (Plot to Remove)" data={mergeData?.plotToRemove} />
            </Grid>
          </Grid>
        </FullScreenDialog>
      )}
    </>
  )
}

export function ConfirmMergeCard({ title, data }){
  return (
    <Card variant="outlined">
      <CardHeader title={title} />
      <CardContent>
        <Typography>
          ID: 
          {' '}
          {data?.id}
        </Typography>
        <Typography>
          Parcel Number: 
          {' '}
          <b>{data?.parcelNumber}</b>
        </Typography>
        <Typography>
          Parcel Type: 
          {' '}
          {data?.parcelType}
        </Typography>
        <Typography>
          Payments?: 
          {' '}
          {(data?.valuations.length > 0) ? 'Yes' : 'No'}
        </Typography>
        <Typography>
          Accounts?: 
          {' '}
          {(data?.accounts.length > 0) ? 'Yes' : 'No'}
        </Typography>
        <Typography>
          Geo-Coordinates?: 
          {' '}
          {(data?.geom) ? 'Yes' : 'No'}
        </Typography>
      </CardContent>
    </Card>
  )
}

LandParcelMergeModal.defaultProps = {
  mergeData: {},
}

ConfirmMergeCard.defaultProps = {
  data: {},
}

LandParcelMergeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  mergeData: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
}

ConfirmMergeCard.propTypes = {
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
}