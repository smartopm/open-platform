import React from 'react'
import { Typography } from '@material-ui/core'

export default function Disclaimer({ body }) {
  return (
    <div>
      <Typography variant="subtitle1">Disclaimer</Typography>
      <Typography variant="body2">{body}</Typography>
    </div>
  )
}
