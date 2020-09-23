import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'

export default function Disclaimer({ body }) {
  return (
    <div className="disclaimer">
      <Typography variant="subtitle1">Disclaimer</Typography>
      <Typography variant="body2">{body}</Typography>
    </div>
  )
}

Disclaimer.propTypes = {
  body: PropTypes.string.isRequired
}