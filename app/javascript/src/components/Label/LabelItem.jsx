import React, { useState } from 'react'
import {
  ListItem,
  Typography,
  IconButton, Grid
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PropTypes from 'prop-types'
import { makeStyles } from "@material-ui/core/styles";
import LabelActionMenu from './LabelActionMenu'


// shortDesc
// number of users
// color
// description
export default function LabelItem({ label, userType, refetch }) {
  // eslint-disable-next-line no-use-before-define
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  function handleClose() {
    setAnchorEl(null)
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }
  return (
    <ListItem key={label.id} className={classes.labelItem}>
      <Grid container spacing={6}>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-title">
            {label.shortDesc}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-users">
            {label.userCount}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" data-testid="label-description">
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
        <LabelActionMenu
          data={label}
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
          refetch={refetch}
        />
      </Grid>
    </ListItem>
  )
}

LabelItem.propTypes = {
    label: PropTypes.shape({
        id: PropTypes.string,
        shortDesc: PropTypes.string,
        userCount: PropTypes.number
    }).isRequired,
    userType: PropTypes.string.isRequired,
}

const useStyles = makeStyles(() => ({
  labelItem: {
      borderBottomStyle: 'solid',
      borderBottomColor: '#F6F6F6',
      borderBottom: 10,
      backgroundColor: '#FFFFFF'
  },
  menuButton: {
    float: 'right'
  },
}));