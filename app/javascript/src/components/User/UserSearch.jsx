import React from 'react'
import {
  TextField,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  RadioGroup
} from '@material-ui/core'
import { useLazyQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { UsersLiteQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'

export default function UserSearch({ userData, update }) {
  const [
    loadUsers,
    { loading: isLoading, error: queryErrors, data }
  ] = useLazyQuery(UsersLiteQuery)

  function handleSearchUser(event) {
    update({ ...userData, user: event.target.value })

    setTimeout(() => {
      loadUsers({
        variables: {
          query: userData.user,
          errorPolicy: 'all',
          fetchPolicy: 'cache-and-network'
        }
      })
    }, 1000)
  }
  return (
    <>
      {!isLoading && !queryErrors ? (
        <TextField
          name="task user"
          label="Find a User"
          placeholder="Type the user name here"
          style={{ width: '100%' }}
          onChange={handleSearchUser}
          value={userData.user}
          fullWidth
          margin="normal"
          inputProps={{
            'aria-label': 'user'
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
      ) : (
        <Spinner />
      )}
      {/* associated user */}
      {data?.users.length ? (
        <FormControl component="fieldset">
          <FormLabel component="legend">Choose a user</FormLabel>
          <RadioGroup
            aria-label="user"
            name="task_user"
            value={userData.userId}
            onChange={e => update({ ...userData, userId: e.target.value })}
          >
            {data?.users.map(user => (
              <FormControlLabel
                key={user.id}
                value={user.id}
                control={<Radio color="primary" />}
                label={user.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ) : (
        Boolean(userData.user.length) &&
        !isLoading &&
        `${userData.user} not found in users`
      )}
      {// separate radios from checkbox only after search
      data?.users.length && <hr />}
    </>
  )
}

UserSearch.propTypes = {
  update: PropTypes.func.isRequired,
  userData: PropTypes.exact({
    user: PropTypes.string,
    userId: PropTypes.string
  })
}
