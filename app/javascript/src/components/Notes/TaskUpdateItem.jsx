/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React from 'react'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

export default function TaskUpdateItem({ user, content, icon }) {

  return(
    <>
      <div style={{display: 'flex'}}>
        {icon}
        <Typography variant="body2" style={{marginTop: '10px'}}>
          <b style={{marginLeft: '12px'}}>
            {user}
          </b>
          {' '}
          {content}
        </Typography>
      </div>
      <Divider orientation="vertical" />
    </>
  )
}
