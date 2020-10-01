import React from 'react'
import {
  ListItem,
  Typography,
  IconButton, Grid
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PropTypes from 'prop-types'

// shortDesc
// number of users
// color
// description
export default function LabelItem({ label, userType }) {
  function handleOpenMenu() {
    // handle modal stuff here
  }
  return (
    <ListItem key={label.id}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-name">
            {label.shortDesc}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-name">
            {label.shortDesc}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-name">
            {label.shortDesc}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {userType === 'admin' && (
          <IconButton
            aria-label={`more-${label.shortDesc}`}
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleOpenMenu}
            dataid={label.id}
          >
            <MoreVertIcon />
          </IconButton>
      )}
        </Grid>
      </Grid>
    </ListItem>
  )
}

LabelItem.propTypes = {
    label: PropTypes.shape({
        id: PropTypes.string,
        shortDesc: PropTypes.string
    }).isRequired
}