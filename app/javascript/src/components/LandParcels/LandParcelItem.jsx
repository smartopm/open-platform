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
    <ListItem key={parcel.id} className={classes.parcelItem}>
      <Grid container spacing={3}>
        <Grid item xs={2} className={classes.parcelGrid}>
          <Typography 
            variant="subtitle1" 
            data-testid="label-title" 
          >
            {parcel.parcelNumber}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="label-users">
            {parcel.address1}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.address2}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.city}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.postalCode}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.stateProvince}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.country}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {parcel.parcelType}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  )
}

ParcelItem.propTypes = {
    parcel: PropTypes.shape({
        id: PropTypes.string,
        parcelNumber: PropTypes.string,
        address1: PropTypes.string,
        address2: PropTypes.string,
        city: PropTypes.string,
        postalCode: PropTypes.string,
        stateProvince: PropTypes.string,
        country: PropTypes.string,
        parcelType: PropTypes.string
    }).isRequired,
    userType: PropTypes.string.isRequired,
    refetch: PropTypes.func.isRequired,
}

const useStyles = makeStyles(() => ({
  parcelItem: {
      borderBottomStyle: 'solid',
      borderBottomColor: '#F6F6F6',
      borderBottom: 10,
      backgroundColor: '#FFFFFF'
  },
  parcelGrid: {
    marginTop: '8px'
  }
}));