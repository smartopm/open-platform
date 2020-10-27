/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React from 'react'
// import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

export default function TaskUpdateList({ data }) {
  const classes = useStyles();

  return(
    <>
      {console.log(data)}
      {data?.map(history => (
        <div key={history.id}>
          {history.action === 'create' && history.noteEntityType === 'NoteComment' && (
            <div style={{display: 'flex'}}>
              <AddBoxOutlinedIcon className={classes.icon} />
              <Typography variant="body2" style={{marginTop: '3px'}}>
                <b style={{marginLeft: '12px'}}>
                  {history.user.name}
                </b>
                {' '}
                added a new comment
              </Typography>
            </div>
          )}
          <Divider orientation="vertical" />
        </div>
      ))}
    </>
  )
}

const useStyles = makeStyles({
  // root: {
  //   padding: '10px 20px 10px 20px',
  //   borderRadius: '0 10px 10px 50px',
  //   backgroundColor: '#f8f8f9',
  //   marginBottom: '10px'
  // },
  icon: {
    padding: '4px',
    marginBottom: '5px',
    fontSize: '40px',
    border: '2px solid #dad9d9',
    color: '#dad9d9',
    borderRadius: '50%'
  }
});