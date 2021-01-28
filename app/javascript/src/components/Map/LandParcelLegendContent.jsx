import React from 'react'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { plotStatusColorPallete } from '../../utils/constants'


export default function LandParcelLegendContent() {
  const { sold, available } = plotStatusColorPallete
  return (
    <Card style={{ width: '160px', opacity: 1 }}>
      <CardContent>
        <Typography variant='body2' component="h5">
          Legend
          <br />
          Nkwashi Plots
        </Typography>
        <br />
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Card style={{ backgroundColor: sold, width: '30px', height: '30px' }} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant='body2' component="p">
              Sold
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Card style={{ backgroundColor: available, width: '30px', height: '30px' }} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant='body2' component="p">
              Available
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}