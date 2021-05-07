import React, { useState } from 'react'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

export default function UserActionOptions(){
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  return (
    <div>
      <IconButton
        aria-label="icons"
        edge="start"
        className={classes.menuButton}
        data-testid="icons"
      >
        {open ? <KeyboardArrowDownIcon onClick={() => setOpen(!open)} /> : <KeyboardArrowRightIcon onClick={() => setOpen(!open)} />}
      </IconButton>
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
  }
}));