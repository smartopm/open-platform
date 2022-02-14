/* eslint-disable no-use-before-define */
import React, { Fragment, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import AddBoxIcon from '@material-ui/icons/AddBox'
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip'
import { css, StyleSheet } from 'aphrodite'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core'
import dateutil from '../../../utils/dateutil'
import { UpdateNote } from '../../../graphql/mutations'
import { UserNotesQuery } from '../../../graphql/queries'
import { Spinner } from '../../../shared/Loading'
import NoteListItem from '../../../shared/NoteListItem';

export function UserNote({ note, handleFlagNote }) {
  const { t } = useTranslation('users')
  return (
    <Fragment key={note.id}>
      <div className={css(styles.commentBox)}>
        <p className="comment">{note.body}</p>
        <i>
          {t("common:misc.created_at")}
          :
          {dateutil.formatDate(note.createdAt)}
        </i>
      </div>


      <br />
    </Fragment>
  )
}

export default function UserNotes({ userId, tabValue }){
  const [isLoading, setLoading] = useState(false)
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

  if (loading || isLoading || !data) return <Spinner />
  if (error) return error.message

  return (
    <>
      {
      data?.userNotes.map(note => <NoteListItem key={note.id} note={note} />)
    }
    </>

  )
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
  tabValue: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  commentBox: {
    borderLeft: '2px solid',
    padding: '0.5%',
  },
  actionIcon: {
    float: 'right',
    cursor: 'pointer',
    marginRight: 12
  }
})