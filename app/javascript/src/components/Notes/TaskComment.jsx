/* eslint-disable */
import React, { useState } from 'react';
import {
  Typography
} from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat';
import CommentTextField from './CommentField'

export default function TaskComment() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div style={{ display: 'flex', marginBottom: "10px" }}>
        <Typography variant="caption" style={{ color: '#69ABA4', marginRight: "15px" }} gutterBottom>
            11 Comments
        </Typography>
        <Typography variant="caption" style={{ cursor: 'pointer', color: '#69ABA4' }} gutterBottom>
          {open ? (<div onClick={() => setOpen(false)}>| <span style={{ marginLeft: "10px" }}>Collapse Comments</span></div>) 
            : (<div style={{ display: 'flex' }} onClick={() => setOpen(true)}><ChatIcon />  <span style={{ marginLeft: "5px" }}>Comment</span></div>)}
        </Typography>
      </div>
      {open && <CommentTextField />}
    </>
  )
}
