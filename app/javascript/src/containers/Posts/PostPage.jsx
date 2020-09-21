/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import {
  Button, Fab, Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Avatar 
} from '@material-ui/core'
import { css } from 'aphrodite'
import CloseIcon from '@material-ui/icons/Close';
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch, useWindowDimensions } from '../../utils/customHooks'
import { ShareButton, styles } from '../../components/ShareButton'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from "../Provider/AuthStateProvider"
import { Spinner } from '../../components/Loading'
import IframeContainer from '../../components/IframeContainer'
import { PostDiscussionQuery, PostCommentsQuery } from '../../graphql/queries'
import Comments from '../../components/Discussion/Comment'
import { DiscussionMutation } from '../../graphql/mutations'
import CenteredContent from '../../components/CenteredContent'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function PostPage() {
  const limit = 20
  const { id } = useParams()
  const authState = useContext(AuthStateContext)
  const currentUrl = window.location.href
  const { width, height } = useWindowDimensions()
  const { response } = useFetch(`${wordpressEndpoint}/posts/${id}`)
  const [isLoading, setLoading] = useState(false);
  const queryResponse = useQuery(PostDiscussionQuery, {
    variables: { postId: id }
  })
  const { loading, data, refetch, fetchMore } = useQuery(PostCommentsQuery, {
    variables: { postId: id, limit }
  })
  const [discuss] = useMutation(DiscussionMutation)

  function createDiscussion(title, discId) {
    setLoading(true)
    discuss({
      variables: { postId: discId.toString(), title }
    })
      .then(() => {
        queryResponse.refetch()
        setLoading(false)
    })
    .catch(err => console.log(err.message))
  }
  const [open, setOpen] = useState(false)

  function handleCommentsView() {
    setOpen(!open)
  }

  function fetchMoreComments() {
    setLoading(true)
    fetchMore({
      variables: { postId: id, offset: data.postComments.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        setLoading(false)
        return { ...prev, postComments: [...prev.postComments, ...fetchMoreResult.postComments]}
      }
    })
  }


  if (!response || queryResponse.loading || loading) {
    return <Spinner />
  }
  // instead of redirecting, ask them to log in
  if (response.categories?.Private && !authState.loggedIn) {
    return <Redirect to="/welcome" />
  }

  return (
    <>
      <Nav
        menuButton="back"
        backTo={authState.loggedIn ? '/news/post' : '/welcome'}
      />
      <div className="post_page">
        <IframeContainer
          link={response?.URL || ''}
          width={width}
          height={height}
        />
        <ShareButton
          url={currentUrl}
          styles={{
            position: 'fixed',
            bottom: 80,
            right: 57
          }}
        />
        
        <Fab
          variant="extended"
          onClick={handleCommentsView}
          className={`btn ${css(styles.getStartedButton)} `}
          color="primary"
        >
          View comments&nbsp;
          <Avatar>{data ? data.postComments.length : 0}</Avatar>
            
        </Fab>
      </div>
      <div> 
        <Dialog fullScreen open={open} onClose={handleCommentsView} TransitionComponent={Transition}>
          <AppBar className={css(styles.appBar)}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleCommentsView} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6">
                Comments
              </Typography>
            </Toolbar>
          </AppBar>
          <br />
          <br />
          <br />
          {queryResponse.data?.postDiscussion ? (
            <>
              <CenteredContent>
                <h4>
                  {queryResponse.data.postDiscussion.title}
                  {' '}
                  Post Discussion
                </h4>
              </CenteredContent>
              <Comments
                comments={data.postComments}
                refetch={refetch}
                discussionId={queryResponse.data.postDiscussion.id}
              />
              {
                data?.postComments.length >= limit && (
                  <CenteredContent>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={fetchMoreComments}
                    >
                      {isLoading ? <Spinner /> : 'Load more comments'}
                    </Button>
                  </CenteredContent>
                )
              }
            </>
        ) : (
          <CenteredContent>
            <br />
            {
                  authState.loggedIn && authState.user.userType === 'admin' ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => createDiscussion(response?.title, response?.ID)}
                      disabled={isLoading}
                    >
                      Create Discussion
                    </Button>
                  ) : 'Discussion has not yet been enabled for this post'
                }
          </CenteredContent>
        )}
        </Dialog>
      </div>
    </>
  )
}


