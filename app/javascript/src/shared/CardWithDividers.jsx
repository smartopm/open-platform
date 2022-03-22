import React from 'react'
import Divider from '@mui/material/Divider';
import { makeStyles } from '@material-ui/core/styles';

export default function CardWithDividers({ children }) {
  const classes = useStyles();
  return (
    <>
      <Divider light />
      <div className={classes.children}>
        {children}
      </div>
      <Divider light />
    </>
  )
}

const useStyles = makeStyles(() => ({
  children: {
    padding: '10px 0'
  }
}))