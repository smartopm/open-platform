import React, { useState, useContext } from 'react'
import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  Button
} from '@mui/material'
import { useMutation, useQuery } from 'react-apollo'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import DiscussionList from '../Components/DiscussionList'
import { DiscussionsQuery } from '../../../graphql/queries'
import Loading, { Spinner } from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import CenteredContent from '../../../components/CenteredContent'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import { DiscussionMutation } from '../../../graphql/mutations'
import FloatButton from '../../../components/FloatButton'
import TitleDescriptionForm from '../../Forms/components/TitleDescriptionForm'

export default function Discussions() {
  const limit = 20
  const { loading, error, data, refetch, fetchMore } = useQuery(
    DiscussionsQuery,
    {
      variables: { limit }
    }
  )
  const [createDiscuss] = useMutation(DiscussionMutation)
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const authState = useContext(AuthStateContext)
  const { t } = useTranslation('discussion')
  function openModal() {
    setOpen(!open)
  }
  function updateList() {
    refetch()
    setOpen(!open)
  }

  function fetchMoreDiscussions() {
    setLoading(true)
    fetchMore({
      variables: { offset: data.discussions.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        setLoading(false)
        return {
          ...prev,
          discussions: [...prev.discussions, ...fetchMoreResult.discussions]
        }
      }
    })
  }

  function saveDiscussion(title, description) {
    setLoading(true)
    createDiscuss({ variables: { title, description } })
      .then(() => {
        setMessage(t('messages.discussion_created'))
        setLoading(false)
        setTimeout(() => {
          updateList()
        }, 1000)
        setOpen(!open)
      })
      .catch(err => {
        setLoading(false)
        setMessage(err.message)
      })
  }

  if (loading) return <Loading />
  if (error) {
    return <ErrorPage title={error.message || error} />
  }
  return (
    <div>
      <>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          fullWidth
          maxWidth="lg"
          onClose={openModal}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <CenteredContent>
              <span>{t('headers.create_discussion')}</span>
            </CenteredContent>
          </DialogTitle>
          <DialogContent>
            <TitleDescriptionForm
              close={updateList}
              type="discussion"
              save={saveDiscussion}
              data={{
                loading: isLoading,
                msg: message
              }}
            />
          </DialogContent>
        </Dialog>

        <DiscussionList
          data={data.discussions}
          refetch={refetch}
          isAdmin={authState?.user?.userType === 'admin'}
        />
        {data.discussions.length >= limit && (
          <CenteredContent>
            <Button variant="outlined" onClick={fetchMoreDiscussions}>
              {isLoading ? <Spinner /> : t('form_actions.more_discussions')}
            </Button>
          </CenteredContent>
        )}
        {authState?.user?.userType === 'admin' && (
          <FloatButton
            title={t('headers.create_discussion')}
            handleClick={openModal}
          />
        )}
      </>
    </div>
  )
}
