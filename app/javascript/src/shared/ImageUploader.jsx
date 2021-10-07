import React from 'react'
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export default function ImageUploader() {
  const classes = useStyles();
  return (
    <>
      <Button
        onClick={() => {}}
        variant="contained"
        data-testid="save"
        className={classes.button}
      >
        Upload Image
      </Button>
    </>
  )
}

const useStyles = makeStyles(() => ({ 
  button: {
    background: '#CACACA'
  }
}))