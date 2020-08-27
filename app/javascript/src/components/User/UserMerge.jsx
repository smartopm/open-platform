import React, { useState } from 'react'
import UserSearch from './UserSearch'
import { Button, Grid, Typography } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { MergeUsersMutation } from '../../graphql/mutations'
import { ModalDialog } from '../Dialog'
import CenteredContent from '../CenteredContent'

// find a user a call the mutation to merge them
const initialData = {
  user: '',
  userId: ''
}
export default function UserMerge({ userId }) {
  const [data, setData] = useState(initialData)
  const [merge] = useMutation(MergeUsersMutation)
  const [loading, setLoading] = useState(false)
  const [open, setConfirmOpen] = useState(false)
  const [message, setMessage] = useState(null)

  function handleMerge() {
    setLoading(true)
    setConfirmOpen(false)
    merge({
      variables: { id: userId, duplicateId: data.userId }
    })
      .then(() => (close(), setLoading(false)))
      .catch(err => console.log(err.message))
  }

  function handleConfirmMerge() {
    if (!data.userId.length) {
      setMessage('You have to select a user')
      return
    }
    setConfirmOpen(!open)
  }
  return (
    <>
      <ModalDialog
        open={open}
        handleClose={close}
        handleConfirm={handleMerge}
        action="proceed"
      >
        <Typography variant="body2">
          Merging this user will keep this account and merge data from the
          selected account into this account. The account being merged will no
          longer exist. Do you want to proceed?
        </Typography>
      </ModalDialog>

      <UserSearch userData={data} update={setData} />
      <br />
      <br />
      <br />

      {message && (
        <CenteredContent>
          <Typography variant="body2">{message}</Typography>
        </CenteredContent>
      )}

      <Grid
        container
        direction="row-reverse"
        justify="space-around"
        alignItems="center"
      >
        <Button
          variant="contained"
          aria-label="merge_cancel"
          color="secondary"
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleConfirmMerge}
          aria-label="merge_btn"
        >
          {loading ? 'Merging ...' : ' Merge Users'}
        </Button>
      </Grid>
      <br />
    </>
  )
}
