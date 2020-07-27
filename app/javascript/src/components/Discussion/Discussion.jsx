import React, { Fragment } from 'react'
import { Divider, Typography, Button, Chip, Avatar  } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done';
import Comment from './Comment'
import { DiscussionCommentsQuery } from '../../graphql/queries'
import { useQuery } from 'react-apollo'
import DateContainer from '../DateContainer'
import Loading, { Spinner } from '../../components/Loading'
import ErrorPage from '../../components/Error'
import CenteredContent from '../CenteredContent'
import { useState } from 'react'

export default function Discussion({ discussionData }) {
  const limit = 20
  const { id } = discussionData
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [subscribe, setSubscribe] =useState('')
  const { loading, error, data, refetch, fetchMore } = useQuery(
    DiscussionCommentsQuery,
    {
      variables: { id, limit }
    }
  )

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function fetchMoreComments() {
    setLoading(true)
    fetchMore({
      variables: { id, offset: data.discussComments.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        setLoading(false)
        return Object.assign({}, prev, {
          discussComments: [
            ...prev.discussComments,
            ...fetchMoreResult.discussComments
          ]
        })
      }
    })
  }
  if (loading) return <Loading />
  if (error) {
    return <ErrorPage title={error.message || error} />
  }

  return (
    <div className="container">
      <Fragment>
        <Typography data-testid="disc_title" variant="h6">
          {discussionData.title}
        </Typography>
        <Typography variant="body1" data-testid="disc_desc">
          {discussionData.description || 'No Description'}
        </Typography>
        <Chip
        avatar={<Avatar>M</Avatar>}
        label="Subscribe"
         clickable
         onClick={handleClickOpen}
        color="success"
        // onDelete={handleDelete}
        deleteIcon={<DoneIcon />}
      />
        {/* <Chip
        avatar={<Avatar>X</Avatar>}
        label="UnSubscribe"
        clickable
        color="success"
        // onDelete={handleDelete}
        deleteIcon={<DoneIcon />}
      /> */}
        <br />
        <Typography variant="body2" data-testid="disc_author">
          <strong>{discussionData.user.name}</strong>
        </Typography>
        <Typography variant="caption">
          <DateContainer date={discussionData.createdAt} />
        </Typography>
        <Divider />
        <br />
        <Typography variant="subtitle1">Comments</Typography>
        <br />
        <Comment
          comments={data.discussComments}
          discussionId={id}
          refetch={refetch}
        />
        {data.discussComments.length >= limit && (
          <CenteredContent>
            <Button variant="outlined" onClick={fetchMoreComments}>
              {isLoading ? <Spinner /> : 'Load more comments'}
            </Button>
          </CenteredContent>
        )}
      </Fragment>
    </div>
  )
}
