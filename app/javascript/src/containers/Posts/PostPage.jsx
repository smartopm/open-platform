import React, { Fragment, useContext, useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import {
  Button, Fab, Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide
} from '@material-ui/core'
import { css } from 'aphrodite'
import CloseIcon from '@material-ui/icons/Close';
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch, useWindowDimensions } from '../../utils/customHooks'
import { ShareButton, styles } from '../../components/ShareButton'
import Nav from '../../components/Nav'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { Spinner } from '../../components/Loading'
import IframeContainer from '../../components/IframeContainer'
import { PostDiscussionQuery, PostCommentsQuery } from '../../graphql/queries'
import Comments from '../../components/Discussion/Comment'
import { DiscussionMutation } from '../../graphql/mutations'



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function PostPage() {
  const { id } = useParams()
  const authState = useContext(AuthStateContext)
  const currentUrl = window.location.href
  const { width, height } = useWindowDimensions()
  const { response } = useFetch(`${wordpressEndpoint}/posts/${id}`)

  const queryResponse = useQuery(PostDiscussionQuery, {
    variables: { postId: id }
  })
  const { loading, data, refetch } = useQuery(PostCommentsQuery, {
    variables: { postId: id }
  })
  const [discuss] = useMutation(DiscussionMutation)

  function createDiscussion(title, id) {
    discuss({
      variables: { postId: id.toString(), title }
    })
    .then(() => queryResponse.refetch())
    .catch(err => console.log(err.message))
  }
  const [open, setOpen] = useState(false)

  function handleCommentsView() {
    setOpen(!open)
  }
  if (!response || queryResponse.loading || loading) {
    return <Spinner />
  }
  // instead of redirecting, ask them to log in
  if (response.categories?.Private && !authState.loggedIn) {
    return <Redirect to="/welcome" />
  }
  return (
    <Fragment>
      <Nav
        menuButton="back"
        backTo={authState.loggedIn ? '/nkwashi_news' : '/welcome'}
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
        <Fab variant="extended"
          onClick={handleCommentsView}
            className={`btn ${css(styles.getStartedButton)} `}
          >
            View comments
        </Fab>
      </div>
      <div> 
      <Dialog fullScreen open={open} onClose={handleCommentsView} TransitionComponent={Transition}>
        <AppBar className={css(styles.appBar)} >
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleCommentsView} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6">
              Comments
            </Typography>
          </Toolbar>
        </AppBar>
        <br/>
        <br/>
        <br/>
        {queryResponse.data.postDiscussion ? (
          <Comments
            comments={data.postComments}
            refetch={refetch}
            discussionId={queryResponse.data.postDiscussion.id}
          />
        ) : (
          <Button
            variant="outlined"
            onClick={() => createDiscussion(response?.title, response?.ID)}
          >
            Create Discussion
          </Button>
        )}
      </Dialog>
      </div>
    </Fragment>
  )
}


