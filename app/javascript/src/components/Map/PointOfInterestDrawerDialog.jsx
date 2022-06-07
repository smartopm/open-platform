import React from 'react'
import PropTypes from 'prop-types'
import { Drawer, Grid, Card, Typography, CardContent, CardActions, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@mui/styles';
import CustomCarousel from '../../shared/CustomCarousel';
import { Spinner } from '../../shared/Loading';

export default function PointOfInterestDrawerDialog({ anchor, children, open, onClose, imageData, selectedPoi }){
  const classes = useStyles();
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.only('sm'));
  const matchesxs = useMediaQuery(theme.breakpoints.only('xs'));
  const { t } = useTranslation('property');

  return (
    <>
      <Drawer
        anchor={anchor}
        open={open}
        onClose={onClose}
        classes={{paper: (matchesSm || matchesxs) ? classes.drawerPaperMobile : classes.drawerPaper }}
        data-testid="poi-drawer"
      >
        {selectedPoi ? (
          <>
            <Grid container>
              <Grid item md={12}>
                <Card sx={{ width: '100%' }} elevation={0} data-testid="drawer-media" style={{ borderRadius: 0 }}>
                  {imageData.loading && <Spinner />}
                  {!imageData.loading && (
                    <CustomCarousel
                      imageUrls={imageData.urls}
                      videoUrls={selectedPoi.videoUrls}
                    />
)}
                  <CardContent data-testid="drawer-content">
                    <div style={{ paddingLeft: '10px', marginTop: '45px' }}>
                      <Typography variant="h6" color="text.secondary">
                        {selectedPoi.poiName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="div">
                        {selectedPoi.description || t('misc.no_description')}
                      </Typography>
                      <br />
                      <hr />
                      <br />
                      <Typography variant="h6" color="text.secondary">{t('dialog_headers.details')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {' '}
                        <b>
                          {t('poi_list.type')}
                          {' '}
                        </b>
                        {' '}
                        Point of Interest
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {' '}
                        <b>
                          {t('poi_list.longitude_x')}
                          {' '}
                        </b>
                        {' '}
                        {selectedPoi.longX}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {' '}
                        <b>
                          {t('poi_list.latitude_y')}
                          {' '}
                        </b>
                        {selectedPoi.latY}
                      </Typography>
                      <br />
                    </div>
                    <CardActions data-testid="drawer-actions">
                      {children}
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
             ) : t('misc.no_details')}
      </Drawer>
    </>
  )
}

const useStyles = makeStyles(() => ({
  drawerPaper: {
    width: '25%',
    border: '0px !important',
    zIndex: 10
  },
  drawerPaperMobile: {
    width: '93%',
  },
}));

PointOfInterestDrawerDialog.defaultProps ={
  anchor: 'right',
  children: null,
  imageData: {
    url: '',
    loading: false,
  },
  selectedPoi: null,
}

PointOfInterestDrawerDialog.propTypes = {
  selectedPoi: PropTypes.shape({
    poiName: PropTypes.string,
    description: PropTypes.string,
    parcelNumber: PropTypes.string,
    parcelType: PropTypes.string,
    longX: PropTypes.number,
    latY: PropTypes.number,
    videoUrls: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  anchor: PropTypes.string,
  children: PropTypes.node,
  imageData: PropTypes.shape({
    urls: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool
  })
}