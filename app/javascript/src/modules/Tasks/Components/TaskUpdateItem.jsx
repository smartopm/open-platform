/* eslint-disable no-use-before-define */
import React from 'react'
import PropTypes from 'prop-types'
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';

export default function TaskUpdateItem({ user, content, icon, date }) {

  return(
    <>
      <div style={{display: 'flex', alignItems: 'center', margin: '8px 0' }}>
        {icon}
        <Typography variant="body2" style={{ marginLeft: '12px' }}>
          <b>
            {user}
          </b>
          {' '}
          {content}
          <br />
          {' '}
          {date}
        </Typography>
      </div>
      <Divider orientation="vertical" data-testid="history_update_divider" />
    </>
  )
}

TaskUpdateItem.defaultProps = {
  user: '',
  content: '',
  icon: {},
  date: '',
 }
 TaskUpdateItem.propTypes = {
   user: PropTypes.string,
   content: PropTypes.string,
   date: PropTypes.string,
   // eslint-disable-next-line react/forbid-prop-types
   icon: PropTypes.object
 } 
