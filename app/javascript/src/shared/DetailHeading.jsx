import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography';

export default function DetailHeading({ title }){
  return (
    <div style={{padding: '20px', background: '#FAFEFE', borderBottom: '1px solid #C3DCD8'}}>
      <Typography color='primary'>{title}</Typography>
    </div>
  )
}

DetailHeading.propTypes = {
  title: PropTypes.string.isRequired
}