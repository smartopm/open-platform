import React from 'react'
import {
  ListItem,
  Divider,
  Typography,
  Box,
  IconButton
} from '@material-ui/core'
import { MoreVertOutlined } from '@material-ui/icons'

// shortDesc
// number of users
// color
// description
export default function LabelItem({ label, userType }) {
  function handleOpenMenu() {
    // handle modal stuff here
  }
  return (
    <ListItem key={label.id}>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginLeft: 30
        }}
      >
        <Typography variant="subtitle1" data-testid="label-name">
          {label.shortDesc}
        </Typography>
      </Box>
      <Divider variant="middle" />
      {userType === 'admin' && (
        <IconButton
          aria-label={`more-${label.name}`}
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleOpenMenu}
          dataid={label.id}
        >
          <MoreVertOutlined />
        </IconButton>
      )}
    </ListItem>
  )
}
