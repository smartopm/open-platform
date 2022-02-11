import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export default function FixedHeader({ children }) {
  const classes = useStyles();
  return (
    <div className="container">
      <div style={{position: 'fixed', zIndex: 1000, background: "#FFFFFF"}}>
        {children}
      </div>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px 0',
    position: 'fixed',
    zIndex: 1000,
    background: "#FFFFFF"
  }
}))