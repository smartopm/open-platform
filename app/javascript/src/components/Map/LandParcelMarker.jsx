import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { StyleSheet, css } from 'aphrodite'
import { useTranslation } from 'react-i18next';
import { titleize } from '../../utils/helpers';

export default function LandParcelMarker({markerProps, category}) {
  const { t } = useTranslation('property')
  return (
    <>
      <Card className={css(styles.card)}>
        {category === 'land' && (
          markerProps.plotSold ? <div data-testid="sold-property" style={{ height: '20px', width: '100%', backgroundColor: '#DB4949' }} />
          : <div data-testid="unknown-property" style={{ height: '20px', width: '100%', backgroundColor: 'rgb(104, 104, 104)' }} />
        )}
        <CardContent data-testid="property-details-section">
          <Typography variant='body2' color="textSecondary" component="p" data-testid="property-number">
            {t('map_markers.property_no')}
            {' '}
            {markerProps.parcelNumber || ''}
          </Typography>
          {category === 'house' && (
          <Typography variant='body2' color="textSecondary" component="p" data-testid="house-status">
            {t('map_markers.house_status')}
            {' '}
            {(markerProps.status && titleize(markerProps.status)) || ''}
          </Typography>
          )}
          {category === 'land' && (
            <Typography variant='body2' color="textSecondary" component="p" data-testid="property-type">
              {t('map_markers.property_type')}
              {' '}
              {(markerProps.parcelType && markerProps.parcelType.toUpperCase()) || ''}
            </Typography>
          )}
          <Typography variant='body2' color="textSecondary" data-testid="property-latY">
            {t('map_markers.latitude_y')}
            {' '}
            {markerProps.geoLatY}
          </Typography>
          <Typography variant='body2' color="textSecondary" data-testid="property-longX">
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
  markerProps: {},
  category: 'land'
 }
 
 LandParcelMarker.propTypes = {
  markerProps: PropTypes.shape({
      geoLongX: PropTypes.number,
      geoLatY: PropTypes.number,
      parcelNumber: PropTypes.string,
      parcelType: PropTypes.string,
      plotSold: PropTypes.bool,
      status: PropTypes.string,
    }),
  category: PropTypes.string,
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 345,
  },
  cardMedia: {
    height: 180,
  }
})