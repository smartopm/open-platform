/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useMutation } from 'react-apollo'
import Button from '@material-ui/core/Button';
import CommentCard from './CommentCard'
import { TaskComment } from '../../graphql/mutations'

export default function CommentTextField({ data, refetch, authState, taskId }) {
  const classes = useStyles();
  const [commentCreate] = useMutation(TaskComment)
  const [body, setBody] = useState('')
  const [error, setErrorMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault();
    commentCreate({ variables: {
      noteId: taskId,
      body
    }}).then(() => {
      setBody('')
      refetch()
    }).catch((err) => setErrorMessage(err))
  }
  return(
    <>
      <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
        <Avatar style={{ marginTop: '7px' }} src={authState.user.imageUrl} alt="avatar-image" />
        <div className={classes.root} style={{ display: 'flex', flexDirection: 'column', color: '#69ABA4' }}>
          <TextField
            value={body}
            multiline
            id="outlined-size-small"
            variant="outlined"
            size="small"
            onChange={e => setBody(e.target.value)}
          />
          <Button variant="contained" color="inherit" type="submit" disabled={!body.length}>SHARE</Button>
        </div>
      </form>
      <CommentCard data={data} refetch={refetch} />
      <p className="text-center">
        {Boolean(error.length) && error}
      </p>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '70%',
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px'
    },
    '& .MuiButton-contained': {
      width: 100,
      marginLeft: '8px',
      backgroundColor: '#69ABA4',
      color: "white"
    },
    '& .Mui-disabled': {
      backgroundColor: '#f8f8f9',
      color: 'white',
      border: '2px white solid'
    }
  }
}));

CommentTextField.defaultProps = {
  data: {},
  authState: {},
  taskId: ''
 }
 CommentTextField.propTypes = {
   data: PropTypes.object,
   authState: PropTypes.object,
   refetch: PropTypes.func.isRequired,
   taskId: PropTypes.string,
 }
