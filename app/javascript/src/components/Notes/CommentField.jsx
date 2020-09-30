/* eslint-disable no-use-before-define */
import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CommentCard from './CommentCard'

export default function CommentTextField() {
  const classes = useStyles();
  return(
    <>
      <div style={{ display: 'flex' }}>
        <Avatar style={{ marginTop: '7px' }} src='https://lh3.googleusercontent.com/a-/AOh14Ghqcs5wKjhN2W7eJx5V3jfGuQno1rSQy4w2krki' alt="avatar-image" />
        <form className={classes.root} noValidate autoComplete="off">
          <div style={{ display: 'flex', flexDirection: 'column', color: '#69ABA4' }}>
            <TextField
              id="outlined-size-small"
              variant="outlined"
              size="small"
            />
            <Button variant="contained" color="inherit">SHARE</Button>
          </div>
        </form>
      </div>
      <CommentCard />
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 350
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px'
    },
    '& .MuiButton-contained': {
      width: 100,
      marginLeft: '8px',
      backgroundColor: '#69ABA4',
      color: "white"
    }
  },
}));