/* eslint-disable no-use-before-define */
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default function EditField({ handleClose }) {
  const classes = useStyles();
  return(
    <>
      <div style={{ display: 'flex' }}>
        <Avatar style={{ marginTop: '7px' }} src='https://lh3.googleusercontent.com/a-/AOh14Ghqcs5wKjhN2W7eJx5V3jfGuQno1rSQy4w2krki' alt="avatar-image" />
        <form className={classes.root} noValidate autoComplete="off">
          <Typography className={classes.title} gutterBottom>
            Tolulope Olaniyan
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', color: '#69ABA4' }}>
            <TextField
              id="outlined-size-small"
              variant="outlined"
              size="small"
            />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
              <Button autoFocus onClick={handleClose} variant="contained" color="primary" style={{ marginRight: '5px' }}>
                Save changes
              </Button>
              <Button onClick={handleClose} variant="outlined" color="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    padding: 10,
    borderRadius: '0 10px 10px 50px',
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});