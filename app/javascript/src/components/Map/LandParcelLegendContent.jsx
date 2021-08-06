import React from 'react'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { plotStatusColorPallete } from '../../utils/constants'


export default function LandParcelLegendContent() {
  const { sold, unknown } = plotStatusColorPallete
  const { t } = useTranslation('property')
  return (
    <Card style={{ width: '160px', opacity: 1 }}>
      <CardContent>
        <Typography variant='body2' component="h5">
          {t('misc.legend')}
        </Typography>
        <br />
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Card style={{ backgroundColor: sold, width: '30px', height: '30px' }} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant='body2' component="p">
              {t('misc.sold')}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Card style={{ backgroundColor: unknown, width: '30px', height: '30px' }} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant='body2' component="p">
              {t('misc.unknown')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}