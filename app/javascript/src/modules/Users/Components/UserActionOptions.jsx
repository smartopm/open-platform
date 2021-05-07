import React, { useState } from 'react'
import { useHistory } from 'react-router';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

export default function UserActionOptions(){
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  function handleOpen(e) {
    setAnchorEl(e.currentTarget)
    setOpen(true)
  }

  function handleClose() {
    setAnchorEl(null)
    setOpen(false)
  }

  return (
    <div className={classes.menuButton}>
      <IconButton
        aria-label="icons"
        edge="start"
      >
        <KeyboardArrowDownIcon data-testid="icons" onClick={(e) => handleOpen(e)} />
      </IconButton>
      <Popover open={open} anchorEl={anchorEl} onClose={handleClose} className={classes.popOver}>
        <Typography data-testid='text' align="center" className={classes.logOut} onClick={() => history.push('/logout')}>
          Log out
        </Typography>
      </Popover>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  menuButton: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: 20,
    right: 10,
    height: '40px'
  },
  logOut: {
    margin: '20px',
    cursor: 'pointer'
  },
  popOver: {
    marginTop: '30px'
  }
}));