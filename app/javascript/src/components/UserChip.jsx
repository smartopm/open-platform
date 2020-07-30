import React from 'react'
import { Chip, Avatar } from '@material-ui/core'
import { forceLinkHttps } from '../utils/helpers'

/**
 * 
 * @param {Object} user (a user object) 
 * @param {Object} props anything else that the Chip components uses from material-ui
 * @returns
 */
export function UserChip({user, ...props}) {
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
