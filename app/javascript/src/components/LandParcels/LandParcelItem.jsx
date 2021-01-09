import React from 'react'
import {
  ListItem,
  Typography, Grid
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles";


export default function ParcelItem({ parcel, onParcelClick }) {
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles();

  return (
    <ListItem key={parcel.id} className={classes.parcelItem} onClick={() => onParcelClick(parcel)}>
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
          <Typography variant="subtitle1" data-testid="parcel-address1">
            {parcel.address1}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="parcel-address2">
            {parcel.address2}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="parcel-city">
            {parcel.city}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="parcel-postal">
            {parcel.postalCode}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="parcel-state">
            {parcel.stateProvince}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="parcel-country">
            {parcel.country}
          </Typography>
        </Grid>
        <Grid item xs={1} className={classes.parcelGrid}>
          <Typography variant="subtitle1" data-testid="parcel-type">
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
    onParcelClick: PropTypes.func.isRequired
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