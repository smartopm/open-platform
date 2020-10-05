import React from 'react'
import {
  ListItem,
  Typography,
  IconButton, Grid
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles";


// shortDesc
// number of users
// color
// description
export default function LabelItem({ label, userType }) {
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles();

  function handleOpenMenu() {
    // handle modal stuff here
  }
  return (
    <ListItem key={label.id} className={classes.labelItem}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-name">
            {label.shortDesc}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-name">
            {label.userCount}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-name">
            This is a label description
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {userType === 'admin' && (
          <IconButton
            className={classes.menuButton}
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

const useStyles = makeStyles(() => ({
  labelItem: {
      borderStyle: 'solid',
      borderColor: '#F6F6F6',
      borderBottom: 10,
      backgroundColor: '#FFFFFF'
  },
  menuButton: {
    float: 'right'
  }
}));