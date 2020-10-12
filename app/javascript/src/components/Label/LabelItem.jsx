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
        <Grid item xs={3} className={classes.labelGrid}>
          <Typography 
            variant="subtitle1" 
            data-testid="label-title" 
            style={{
              textAlign: 'center', 
              backgroundColor: `${label.color}`,
              color: '#ffffff',
              borderRadius: '5px'
            }}
          >
            {label.shortDesc}
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-users">
            {label.userCount}
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.labelGrid}>
          <Typography variant="subtitle1" data-testid="label-description">
            {label.description}
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
        color: PropTypes.string,
        description: PropTypes.string,
        userCount: PropTypes.number
    }).isRequired,
    userType: PropTypes.string.isRequired,
    refetch: PropTypes.func.isRequired,
}

const useStyles = makeStyles(() => ({
  labelItem: {
      borderBottomStyle: 'solid',
      borderBottomColor: '#F6F6F6',
      borderBottom: 10,
      backgroundColor: '#FFFFFF'
  },
  labelGrid: {
    marginTop: '8px'
  },
  menuButton: {
    float: 'right'
  },
}));