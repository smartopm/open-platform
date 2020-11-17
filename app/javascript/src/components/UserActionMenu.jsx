import React, {useState} from 'react'
import { Grid, Select, MenuItem, Typography, Button } from '@material-ui/core'
import CampaignIcon from './Campaign/CampaignIcon'

export default function UserActionMenu() {
  const [selectValue, setSelectValue] = useState('none')

  return (
    <Grid container>
      <Grid item style={{ display: 'flex' }}>
        <Typography> Select </Typography>
        <Select
          labelId="user-action-select"
          id="user-action-select"
          value={selectValue}
          onChange={event => setSelectValue(event.target.value)}
          style={{ height: '23px', marginLeft: '10px' }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="none">None</MenuItem>
        </Select>
      </Grid>
      {
        selectValue !== 'none' && (
        <Grid item style={{ marginLeft: '20px', marginTop: '-4px' }}>
          <Button
            href="/"
            color='primary'
            startIcon={<CampaignIcon />}
            style={{textTransform: "none"}}
          >
            Create Campaign
          </Button>
        </Grid>
      )
}
    </Grid>
  )
}
