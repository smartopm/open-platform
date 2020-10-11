/* eslint-disable no-use-before-define */
import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import Badge from '@material-ui/core/Badge'
import ListItemText from '@material-ui/core/ListItemText'
import { useHistory } from 'react-router-dom'
import { css, StyleSheet } from 'aphrodite'
import DateContainer from '../DateContainer'

export default function UserFilledForms({ userFormsFilled }) {
  const history = useHistory()

  return (
    <div className="container">
      {userFormsFilled.map(userForm => (
        <ListItem
          alignItems="flex-start"
          onClick={() => history.push(`/form/${userForm.form.id}`)}
          key={userForm.id}
          button
        >
          <ListItemText
            primary={(
              <>
                <span className="nz_msg_owner">
                  {userForm.form.name}
                  <Badge
                    className="nz_msg_tag"
                    color="secondary"
                    badgeContent={<span>{userForm.status}</span>}
                    style={{ marginLeft: 35 }}
                  />

                  <span className={css(styles.timeStamp)}>
                    Created: 
                    {' '}
                    <DateContainer date={userForm.createdAt} />
                  </span>
                </span>
              </>
            )}
          />
        </ListItem>
      ))}
    </div>
  )
}

UserFilledForms.propTypes = {
  userFormsFilled: PropTypes.arrayOf(
    PropTypes.shape({
      form: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })
    })
  ).isRequired
}

const styles = StyleSheet.create({
  timeStamp: {
    float: 'right',
    fontSize: 14,
    color: '#737380'
  }
})
