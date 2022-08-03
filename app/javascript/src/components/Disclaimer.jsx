/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import Card from '@mui/material/Card';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


export default function Disclaimer({ body }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  return (
    <>
      <Card className={classes.root} onClick={() => setOpen(!open)}>
        <EmojiObjectsIcon className={classes.bulbIcon} />
        <Typography variant="subtitle1">A note about your activity</Typography>
        {open ? <KeyboardArrowDownIcon className={classes.arrow} /> 
          : <KeyboardArrowRightIcon className={classes.arrow} />}
        
      </Card>
      {open && (
        <div style={{textAlign: 'justify'}}>{body}</div>
      )}
    </>
  )
}

const useStyles = makeStyles({
  root: {
    backgroundColor: '#f8f8f9',
    margin: '5px',
    display: 'flex'
  },
  arrow: {
    marginLeft: 'auto',
    order: 2
  },
  bulbIcon: {
    marginRight: '5px',
    color: '#fddc38'
  }
});

Disclaimer.propTypes = {
  body: PropTypes.string.isRequired
}
