import React from 'react'
import { Chip, Avatar } from '@material-ui/core'
import { forceLinkHttps } from '../utils/helpers'

export function UserChip(user, props) {
  return (
    <Chip
      style={{ margin: 5 }}
      variant="outlined"
      label={user.name}
      avatar={<Avatar src={forceLinkHttps(user.imageUrl)} alt={user.name} />}
      {...props}
    />
  )
}
