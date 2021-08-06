import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { StyleSheet, css } from 'aphrodite'
import { useTranslation } from 'react-i18next';
import SVGSoldIcon from '../../../../assets/images/sold-icon.svg'
import SVGAvailableIcon from '../../../../assets/images/unknown-icon.svg'

export default function LandParcelMarker({markerProps}) {
  const { t } = useTranslation('property')
  return (
    <>
      <Card className={css(styles.card)}>
        <CardMedia
          className={css(styles.cardMedia)}
          image={(markerProps.plotSold) ? SVGSoldIcon : SVGAvailableIcon}
          title={(markerProps.plotSold) ? t('map_markers.sold') : t('map_markers.available')}
        />
        <CardContent>
          <Typography variant='body2' color="textSecondary" component="p">
            {t('map_markers.property_no')}
            {' '}
            {markerProps.parcelNumber || ''}
          </Typography>
          <Typography variant='body2' color="textSecondary" component="p">
            {t('map_markers.property_type')}
            {' '}
            {(markerProps.parcelType && markerProps.parcelType.toUpperCase()) || ''}
          </Typography>
          <Typography variant='body2' color="textSecondary">
            {t('map_markers.latitude_y')}
            {' '}
            {markerProps.geoLatY}
          </Typography>
          <Typography variant='body2' color="textSecondary">
            {t('map_markers.longitude_x')}
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