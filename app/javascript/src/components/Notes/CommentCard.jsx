/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TaskDelete from './TaskDelete'
import EditField from './TaskCommentEdit'

export default function CommentCard({ deleteModal }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false) 
  const [edit, setEdit] = useState(false)
  return(
    <>
      <Card style={{ display: 'flex' }} className={classes.root}>
        {!edit && <Avatar src='https://lh3.googleusercontent.com/a-/AOh14Ghqcs5wKjhN2W7eJx5V3jfGuQno1rSQy4w2krki' alt="avatar-image" style={{ marginTop: '7px' }} />}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {!edit && (
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Tolulope Olaniyan
              </Typography>
              <Typography variant="caption" component="h2">
                Hi, i am just testing out this cool feature
              </Typography>
            </CardContent>
          )}
          {(!deleteModal && !edit) && (
            <CardActions style={{ color: '#69ABA4'  }}>
              <Button size="small" color="inherit" onClick={() => setEdit(true)}>Edit</Button>
              {' '}
              |
              <Button size="small" color="inherit" onClick={() => setOpen(true)}>Delete</Button>
            </CardActions>
          )}
        </div>
        {!deleteModal && edit && <EditField handleClose={() => setEdit(false)} />}
      </Card>
      <TaskDelete open={open} handleClose={() => setOpen(false)} />
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