/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import Card from '@material-ui/core/Card';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';


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
