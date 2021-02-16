import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { StyleSheet, css } from 'aphrodite'
import SVGSoldIcon from '../../../../assets/images/sold-icon.svg'
import SVGAvailableIcon from '../../../../assets/images/available-icon.svg'

export default function LandParcelMarker({markerProps}) {
  return (
    <>
      <Card className={css(styles.card)}>
        <CardMedia
          className={css(styles.cardMedia)}
          image={(markerProps.plotSold) ? SVGSoldIcon : SVGAvailableIcon}
          title={(markerProps.plotSold) ? 'Sold' : 'Available'}
        />
        <CardContent>
          <Typography variant='body2' color="textSecondary" component="p">
            Property No:
            {' '}
            {markerProps.parcelNumber || ''}
          </Typography>
          <Typography variant='body2' color="textSecondary" component="p">
            Property Type:
            {' '}
            {(markerProps.parcelType && markerProps.parcelType.toUpperCase()) || ''}
          </Typography>
          <Typography variant='body2' color="textSecondary">
            LatitudeY:
            {' '}
            {markerProps.geoLatY}
          </Typography>
          <Typography variant='body2' color="textSecondary">
            LongitudeX:
            {' '}
            {markerProps.geoLongX}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

LandParcelMarker.defaultProps = {
  markerProps: {}
 }
 
 LandParcelMarker.propTypes = {
  markerProps: PropTypes.shape({
      geoLongX: PropTypes.number,
      geoLatY: PropTypes.number,
      parcelNumber: PropTypes.string,
      parcelType: PropTypes.string,
      plotSold: PropTypes.bool,
    }),
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 345,
  },
  cardMedia: {
    height: 180,
  }
})