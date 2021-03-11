import React, { useContext, useState } from 'react'
import {
  Divider,
  Typography,
  Button,
  Grid
} from '@material-ui/core'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import Comment from './Comment'
import {
  DiscussionCommentsQuery
} from '../../graphql/queries'
import DateContainer from '../DateContainer'
import Loading, { Spinner } from '../../shared/Loading'
import ErrorPage from "../Error"
import CenteredContent from '../CenteredContent'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import FollowButton from './FollowButton'
import Disclaimer from '../Disclaimer'
import userProps from '../../shared/types/user'

export default function Discussion({ discussionData }) {
  const limit = 20
  const { id } = discussionData
  const authState = useContext(AuthStateContext)
  const [isLoading, setLoading] = useState(false)
  const { loading, error, data, refetch, fetchMore } = useQuery(
    DiscussionCommentsQuery,
    {
      variables: { id, limit }
    }
  )
  const discussionBoardDisclaimer =
    `Comments and discussion boards are provided as a free service for logged in community members.
    Users must keep comments constructive, informative, positive, and free of profanity and obscenity.
    We reserve the right to remove posts or boards that veer from these principles.`


  function fetchMoreComments() {
    setLoading(true)
    fetchMore({
      variables: { id, offset: data.discussComments.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        setLoading(false)
        return { ...prev, discussComments: [
            ...prev.discussComments,
            ...fetchMoreResult.discussComments
          ]}
      }
    })
  }

  if (loading) return <Loading />
  if (error) {
    return <ErrorPage title={error.message || error} />
  }

  return (
    <div className="container">
      <>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography data-testid="disc_title" variant="h6">
              {discussionData.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" data-testid="disc_desc">
              {discussionData.description || 'No Description'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" data-testid="disc_author">
              <strong>{discussionData.user.name}</strong>
            </Typography>
            <Typography variant="caption">
              <DateContainer date={discussionData.createdAt} />
            </Typography>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <FollowButton discussionId={id} authState={authState} />
          </Grid>
          <br />
          <Grid item xs={6}>
            <Disclaimer body={discussionBoardDisclaimer} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Comments</Typography>
          </Grid>
          <Grid item xs={12}>
            <Comment
              comments={data?.discussComments}
              discussionId={id}
              refetch={refetch}
            />
            {data?.discussComments.length >= limit && (
              <CenteredContent>
                <Button variant="outlined" onClick={fetchMoreComments}>
                  {isLoading ? <Spinner /> : 'Load more comments'}
                </Button>
              </CenteredContent>
            )}
          </Grid>
        </Grid>
      </>
    </div>
  )
}

Discussion.propTypes = {
  discussionData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: userProps,
    description: PropTypes.string,
    title: PropTypes.string.isRequired
  }).isRequired,
}
