/* eslint-disable import/no-cycle */
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
import DateContainer from '../DateContainer'

export default function CommentCard({ data, refetch }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false) 
  const [editId, setEditId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [id, setId] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [name, setName] = useState(null)
  const [body, setBody] = useState(null)
  function handleClose() {
    setEdit(false)
    setEditId(null)
  }

  function deleteClick(event) {
    setId(event.currentTarget.getAttribute('id'))
    setImageUrl(event.currentTarget.getAttribute('image'))
    setName(event.currentTarget.getAttribute('name'))
    setBody(event.currentTarget.getAttribute('body'))
    setOpen(true)
  }

  return(
    <>
      {data.noteComments.map((com) => (
        <Card style={{ display: 'flex' }} className={classes.root} key={com.id}>
          {!edit && editId !== com.id && <Avatar src={com.user.imageUrl} alt="avatar-image" style={{ marginTop: '7px' }} />}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {!edit && editId !== com.id && ( 
            <CardContent>
              <div style={{ display: 'flex' }}>
                <Typography className={classes.title} gutterBottom>
                  {com.user.name}
                </Typography>
                <span 
                  data-testid="delete_icon" 
                  className={classes.itemAction}
                >
                  <DateContainer date={com.createdAt} />
                </span>
              </div>
              <Typography variant="caption" component="h2">
                {com.body}
              </Typography>
            </CardContent>
            )}
            {(!edit && editId !== com.id) && (
            <CardActions style={{ color: '#69ABA4'  }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => setEditId(com.id)}
              >
                Edit
              </Button>
              {' '}
              |
              <Button
                size="small"
                color="inherit"
                id={com.id}
                name={com.user.name}
                image={com.user.imageUrl} 
                body={com.body}
                onClick={(event) => deleteClick(event)}
              >
                Delete
              </Button>
            </CardActions>
            )}
            {editId === com.id  && <EditField handleClose={handleClose} data={com} refetch={refetch} />}
          </div>
        </Card>
      ))}
      {open && (
      <TaskDelete
        open={open}
        handleClose={() => setOpen(false)} 
        id={id}
        name={name}
        imageUrl={imageUrl} 
        refetch={refetch}
        body={body}
      />
    )}
    </>
  )
}

const useStyles = makeStyles({
  root: {
    padding: '10px 20px 10px 20px',
    borderRadius: '0 10px 10px 50px',
    backgroundColor: '#f8f8f9',
    marginBottom: '10px'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemAction: {
    marginLeft: 'auto',
    order: 2
  }
});