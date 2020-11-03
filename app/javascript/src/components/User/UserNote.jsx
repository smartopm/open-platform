/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-use-before-define */
import React, { Fragment, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import AddBoxIcon from '@material-ui/icons/AddBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Tooltip from '@material-ui/core/Tooltip'
import { css, StyleSheet } from 'aphrodite'
import PropTypes from 'prop-types'
import dateutil from '../../utils/dateutil'
import { UpdateNote } from '../../graphql/mutations'
import { UserNotesQuery } from '../../graphql/queries'

export default function UserNote({ note, handleOnComplete, handleFlagNote }) {
  return (
    <Fragment key={note.id}>
      <div className={css(styles.commentBox)}>
        <p className="comment">{note.body}</p>
        <i>
          created at:
          {dateutil.formatDate(note.createdAt)}
        </i>
      </div>

      {note.completed ? (
        <span
          className={css(styles.actionIcon)}
          onClick={() => handleOnComplete(note.id, note.completed)}
        >
          <Tooltip title="Mark this note as incomplete">
            <CheckBoxIcon />
          </Tooltip>
        </span>
      ) : !note.flagged ? (
        <span />
      ) : (
        <span
          className={css(styles.actionIcon)}
          onClick={() => handleOnComplete(note.id, note.completed)}
        >
          <Tooltip title="Mark this note complete">
            <CheckBoxOutlineBlankIcon />
          </Tooltip>
        </span>
      )}
      {!note.flagged && (
        <span
          className={css(styles.actionIcon)}
          onClick={() => handleFlagNote(note.id)}
        >
          <Tooltip title="Flag this note as a todo ">
            <AddBoxIcon />
          </Tooltip>
        </span>
      )}
      <br />
    </Fragment>
  )
}

export function UserNotes(){
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setLoading] = useState(false)
  const [noteUpdate] = useMutation(UpdateNote)
  // eslint-disable-next-line no-unused-vars
  const { loading, refetch, data } = useQuery(UserNotesQuery)

  function handleFlagNote(id) {
    setLoading(true)
    noteUpdate({ variables: { id, flagged: true } }).then(() => {
      setLoading(false)
      refetch()
    })
  }

  function handleOnComplete(id, isCompleted) {
    setLoading(true)
    noteUpdate({ variables: { id, completed: !isCompleted } }).then(() => {
      setLoading(false)
      refetch()
    })
  }

  return data.map(note => (
    <UserNote
      key={note.id}
      note={note}
      handleFlagNote={handleFlagNote}
      handleOnComplete={handleOnComplete}
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
  handleOnComplete: PropTypes.func.isRequired,
  handleFlagNote: PropTypes.func.isRequired,
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
