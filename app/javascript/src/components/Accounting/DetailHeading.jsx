import React from 'react'
import Typography from '@material-ui/core/Typography';

export default function DetailHeading({ title }){
  return (
    <div style={{padding: '20px', background: '#FAFEFE', borderBottom: '1px solid #C3DCD8'}}>
      <Typography color='primary'>{title}</Typography>
    </div>
  )
}