/* eslint-disable no-use-before-define */
import React from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

export default function TaskUpdateItem({ user, content, icon, date }) {

  return(
    <>
      <div style={{display: 'flex'}}>
        {icon}
        <Typography variant="body2" style={{marginTop: '10px', marginLeft: '12px'}}>
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
      <Divider orientation="vertical" />
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