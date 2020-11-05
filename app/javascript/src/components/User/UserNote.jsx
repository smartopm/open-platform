/* eslint-disable no-use-before-define */
import React, { Fragment, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import AddBoxIcon from '@material-ui/icons/AddBox'
import Tooltip from '@material-ui/core/Tooltip'
import { css, StyleSheet } from 'aphrodite'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core'
import dateutil from '../../utils/dateutil'
import { UpdateNote } from '../../graphql/mutations'
import { UserNotesQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'

export function UserNote({ note, handleFlagNote }) {
  return (
    <Fragment key={note.id}>
      <div className={css(styles.commentBox)}>
        <p className="comment">{note.body}</p>
        <i>
          created at:
          {dateutil.formatDate(note.createdAt)}
        </i>
      </div>

      <Tooltip title="Flag as a todo ">
        <IconButton 
          aria-label="Flag as a todo" 
          onClick={() => handleFlagNote(note.id)}
          className={css(styles.actionIcon)}
        >
          <AddBoxIcon />
        </IconButton>
      </Tooltip>
      <br />
    </Fragment>
  )
}

export default function UserNotes({ userId, tabValue }){
  const [isLoading, setLoading] = useState(false)
  const [noteUpdate] = useMutation(UpdateNote)
  const [loadNotes, { loading, error, refetch, data }] = useLazyQuery(UserNotesQuery, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  })

  useEffect(() => {
    if (tabValue === 'Notes') {
      loadNotes()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue])

  function handleFlagNote(id) {
    setLoading(true)
    noteUpdate({ variables: { id, flagged: true } }).then(() => {
      setLoading(false)
      refetch()
    })
  }

  if (loading || isLoading || !data) return <Spinner />
  if (error) return error.message

  return data?.userNotes.map(note => (
    <UserNote
      key={note.id}
      note={note}
      handleFlagNote={handleFlagNote}
    />
  ))
}


UserNote.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,
    completed: PropTypes.bool,
    createdAt: PropTypes.string,
    body: PropTypes.string,
    flagged: PropTypes.bool
  }).isRequired,
  handleFlagNote: PropTypes.func.isRequired,
}

UserNotes.propTypes = {
  userId: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  commentBox: {
    borderLeft: '2px solid #69ABA4',
    padding: '0.5%',
    color: 'gray'
  },
  actionIcon: {
    float: 'right',
    cursor: 'pointer',
    ':hover': {
      color: '#69ABA4'
    },
    marginRight: 12
  }
})
