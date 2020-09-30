/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useMutation } from 'react-apollo'
import Button from '@material-ui/core/Button';
import CommentCard from './CommentCard'
import { TaskComment } from '../../graphql/mutations'

export default function CommentTextField({ data }) {
  const classes = useStyles();
  const [commentCreate] = useMutation(TaskComment)
  const [body, setBody] = useState('')

  function handleSubmit() {
    console.log('got here')
    commentCreate({ variables: {
      noteId: data.id,
      body
    }}).then(({ data: conD }) => console.log(conD.body))
  }
  return(
    <>
      <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
        <Avatar style={{ marginTop: '7px' }} src='https://lh3.googleusercontent.com/a-/AOh14Ghqcs5wKjhN2W7eJx5V3jfGuQno1rSQy4w2krki' alt="avatar-image" />
        <div className={classes.root} style={{ display: 'flex', flexDirection: 'column', color: '#69ABA4' }}>
          <TextField
            id="outlined-size-small"
            variant="outlined"
            size="small"
            onChange={e => setBody(e.target.value)}
          />
          <Button variant="contained" color="inherit" type="submit">SHARE</Button>
        </div>
      </form>
      <CommentCard data={data} />
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