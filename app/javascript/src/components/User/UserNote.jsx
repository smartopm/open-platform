/* eslint-disable */
import React, { Fragment } from 'react'
import AddBoxIcon from '@material-ui/icons/AddBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Tooltip from '@material-ui/core/Tooltip'
import { css, StyleSheet } from 'aphrodite'
import dateutil from '../../utils/dateutil'

export function UserNote({ note, handleOnComplete, handleFlagNote }) {
  return (
    <Fragment key={note.id}>
      <div className={css(styles.commentBox)}>
        <p className="comment">{note.body}</p>
        <i>created at: {dateutil.formatDate(note.createdAt)}</i>
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
