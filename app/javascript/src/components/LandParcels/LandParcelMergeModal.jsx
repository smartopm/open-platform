import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardContent, CardHeader, Grid, Typography} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FullScreenDialog } from '../Dialog'

export default function LandParcelMergeModal({ open, mergeData, handleClose, handleSubmit }){
  const { t } = useTranslation('property')
  return (
    <>
      {mergeData && (
        <FullScreenDialog
          open={open}
          handleClose={handleClose}
          title={t('misc.parcel_merge_dialog')}
          actionText={t('buttons.merge_and_save')}
          handleSubmit={handleSubmit}
        >
          <h3>{t('messages.merge_properties')}</h3>
          <br />
          <br />
          <Grid container spacing={1}>
            <Grid item xs={12} md={3} sm={3}>
              <b>{t('misc.selected_property')}</b>
              <b> + </b>
              <b>{t('misc.existing_property')}</b>
              {' ===> '}
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <b>{t('misc.merge_plot_to_keep')}</b>
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <b>{t('misc.merge_plot_to_remove')}</b>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container spacing={1}>
            <Grid item xs={12} md={3} sm={3}>
              <ConfirmMergeCard title={t('misc.selected_property')} data={mergeData?.selectedPlot} />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <ConfirmMergeCard title={t('misc.existing_property')} data={mergeData?.existingPlot} />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <ConfirmMergeCard title={t('misc.merge_plot_to_keep')} data={mergeData?.plotToMerge} />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <ConfirmMergeCard title={t('misc.merge_plot_to_remove')} data={mergeData?.plotToRemove} />
            </Grid>
          </Grid>
        </FullScreenDialog>
      )}
    </>
  )
}

export function ConfirmMergeCard({ title, data }){
  const { t } = useTranslation('property')
  return (
    <Card variant="outlined">
      <CardHeader title={title} />
      <CardContent>
        <Typography>
          {t('misc.id')}
          {' '}
          {data?.id}
        </Typography>
        <Typography>
          {t('misc.parcel_number')}
          {' '}
          <b>{data?.parcelNumber}</b>
        </Typography>
        <Typography>
          {t('misc.parcel_type')}
          {' '}
          {data?.parcelType}
        </Typography>
        <Typography>
          {t('misc.payments')}
          {' '}
          {(data?.valuations.length > 0) ? t('misc.yes') : t('misc.no')}
        </Typography>
        <Typography>
          {t('misc.accounts')}
          {' '}
          {(data?.accounts.length > 0) ? t('misc.yes') : t('misc.no')}
        </Typography>
        <Typography>
          {t('misc.geo_coordinates')}
          {' '}
          {(data?.geom) ? t('misc.yes') : t('misc.no')}
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