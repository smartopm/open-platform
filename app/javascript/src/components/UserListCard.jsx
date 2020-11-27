import React from 'react'
import PropTypes from 'prop-types'
import { List } from '@material-ui/core'
import UserItem from './UserItem'

export default function UserListCard({
  userData,
  currentUserType,
  sendOneTimePasscode,
  handleUserSelect,
  selectedUsers
}) {
  return (
    <List>
      {userData.users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          currentUserType={currentUserType}
          sendOneTimePasscode={sendOneTimePasscode}
          handleUserSelect={handleUserSelect}
          selectedUsers={selectedUsers}
        />
      ))}
    </List>
  )
}

UserListCard.propTypes = {
  userData: PropTypes.shape({
    users: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  currentUserType: PropTypes.string.isRequired,
  sendOneTimePasscode: PropTypes.func.isRequired,
  handleUserSelect: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.number).isRequired
}
