import React from 'react'
import PropTypes from 'prop-types'
import { List } from '@material-ui/core'
import UserItem from './UserItem'

export default function UserListCard({
  userData,
  currentUserType,
  handleUserSelect,
  selectedUsers,
  offset,
  selectCheckBox
}) {
  return (
    <List>
      {userData.users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          currentUserType={currentUserType}
          handleUserSelect={handleUserSelect}
          selectedUsers={selectedUsers}
          offset={offset}
          selectCheckBox={selectCheckBox}
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
  handleUserSelect: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  selectCheckBox: PropTypes.bool.isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired
}
