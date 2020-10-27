/* eslint-disable no-use-before-define */
import React from 'react'
import PropTypes from 'prop-types'
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

TaskUpdateItem.defaultProps = {
  user: '',
  content: '',
  icon: {}
 }
 TaskUpdateItem.propTypes = {
   user: PropTypes.string,
   content: PropTypes.string,
   // eslint-disable-next-line react/forbid-prop-types
   icon: PropTypes.object
 } 
