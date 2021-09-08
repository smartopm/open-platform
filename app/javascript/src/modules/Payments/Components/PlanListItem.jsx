import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import PaymentSlider from './PaymentSlider'
import Label from '../../../shared/label/Label';
import { capitalize } from '../../../utils/helpers';

export default function PlanListItem({ data, currencyData }) {
  const [checked, setChecked] = useState(false)
  function handleCheckChanged() {
    setChecked(!checked)
  }

  const colors = {
    'cancelled': '#e74540',
    'on track': '#00a98b',
    'behind': '#eea92d',
    'completed': '#29ec47'
  }

  function planStatus(plan) {
    if(plan.status !== 'active'){
      return plan.status;
    }
    if(plan.owingAmount > 0){
      return 'behind';
    }
    return 'on track';
  }
  
  return (
    <>
      {console.log(data)}
      <Grid container spacing={2} style={{backgroundColor: 'white', padding: '20px'}}>
        <Grid item xs={2}>
          <Grid container>
            <Grid item xs={2} style={{marginTop: '-8px'}}>
              <Checkbox
                checked={checked}
                onChange={handleCheckChanged}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
            <Grid xs={2}>
              <ExpandMoreIcon />
            </Grid>
            <Grid xs={8}>
              <Typography variant='caption'>{data?.landParcel?.parcelNumber}</Typography>
              {' '}
              -
              {' '}
              <Typography variant='caption'>{data?.planType}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <PaymentSlider data={data} currencyData={currencyData} />
        </Grid>
        <Grid item xs={2}>
          <Label
            title={capitalize(planStatus(data))}
            color={colors[planStatus(data)]}
          />
        </Grid>
      </Grid>
    </>
  )
}