import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';

export default function GraphTitle({title}) {
  return (
    <div style={{background: '#FFF', padding: '5px 15px'}}>
      <Typography align='right'>{title}</Typography>
    </div>
  )
}

GraphTitle.propTypes = {
  title: PropTypes.string.isRequired
}