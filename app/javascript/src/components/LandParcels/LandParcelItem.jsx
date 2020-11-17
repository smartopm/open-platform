import React, { useState } from 'react'
import {
  ListItem,
  Typography,
  IconButton, Grid
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles";


export default function ParcelItem({ parcel }) {
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles();

  return (
    <ListItem key={parcel.id} className={classes.labelItem}>
      <Grid container spacing={3}>
        <Grid item xs={2} className={classes.labelGrid}>
          <Typography 
            variant="subtitle1" 
            data-testid="label-title" 
          >
            {parcel.parcelNumber}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-users">
            {parcel.address1}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.address2}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.city}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.postalCode}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.stateProvince}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.country}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.parcelType}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  )
}

// LabelItem.propTypes = {
//     label: PropTypes.shape({
//         id: PropTypes.string,
//         shortDesc: PropTypes.string,
//         color: PropTypes.string,
//         description: PropTypes.string,
//         userCount: PropTypes.number
//     }).isRequired,
//     userType: PropTypes.string.isRequired,
//     refetch: PropTypes.func.isRequired,
// }

const useStyles = makeStyles(() => ({
  labelItem: {
      borderBottomStyle: 'solid',
      borderBottomColor: '#F6F6F6',
      borderBottom: 10,
      backgroundColor: '#FFFFFF'
  },
  labelGrid: {
    marginTop: '8px'
  }
}));