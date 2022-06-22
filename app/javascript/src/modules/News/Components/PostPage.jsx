import React, { useContext, useEffect, useState } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo';
import {
  Button,
  Fab,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Avatar
} from '@mui/material';
import { css } from 'aphrodite';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from '../../../utils/customHooks';
import { ShareButton, styles } from '../../../components/ShareButton';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { Spinner } from '../../../shared/Loading';
import IframeContainer from '../../../components/IframeContainer';
import { PostDiscussionQuery, PostCommentsQuery } from '../../../graphql/queries';
import Comments from '../../Discussions/Components/Comment';
import { DiscussionMutation } from '../../../graphql/mutations';
import CenteredContent from '../../../shared/CenteredContent';
import TagsComponent from './Tags';
import MessageAlert from '../../../components/MessageAlert';
import { NewsNav } from '../../Menu';
import { CurrentCommunityQuery } from '../../Community/graphql/community_query';
import useStateIfMounted from '../../../shared/hooks/useStateIfMounted';

// TODO: Reuse this component
// eslint-disable-next-line
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PostPage() {
  const limit = 20;
  const { id } = useParams();
  const history = useHistory();
  const authState = useContext(AuthStateContext);
  const currentUrl = window.location.href;
  const { width, height } = useWindowDimensions();

  const [isLoading, setLoading] = useState(false);
  const queryResponse = useQuery(PostDiscussionQuery, {
    variables: { postId: id }
  });
  const { loading, data, refetch, fetchMore } = useQuery(PostCommentsQuery, {
    variables: { discussionId: id, limit }
  });
  const communityQuery = useQuery(CurrentCommunityQuery);
  const [discuss] = useMutation(DiscussionMutation);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [response, setData] = useState({});
  const [error, setError] = useStateIfMounted(null);
  const { t } = useTranslation(['news', 'common']);
  const fetchData = async url => {
    try {
      const result = await fetch(url);
      const json = await result.json();
      setData(json);
    } catch {
      setError(t('news.no_post_found'));
    }
  };

  useEffect(() => {
    if (!communityQuery.loading && communityQuery.data?.currentCommunity) {
      fetchData(`${communityQuery.data?.currentCommunity.wpLink}/posts/${id}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityQuery.loading]);

  function createDiscussion(title, discId) {
    setLoading(true);
    discuss({
      variables: { postId: discId.toString(), title }
    })
      .then(() => {
        queryResponse.refetch();
        setLoading(false);
      })
      .catch(err => {
        setMessageAlert(err.message);
        setIsSuccessAlert(false);
      });
  }
  const [open, setOpen] = useState(false);

  function handleCommentsView() {
    setOpen(!open);
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function fetchMoreComments() {
    setLoading(true);
    fetchMore({
      variables: { postId: id, offset: data.postComments.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        setLoading(false);
        return { ...prev, postComments: [...prev.postComments, ...fetchMoreResult.postComments] };
      }
    });
  }

  if (!response || queryResponse.loading || loading || communityQuery.loading) {
    return <Spinner />;
  }
  // instead of redirecting, ask them to log in
  if (response.categories?.Private && !authState.loggedIn) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />

      <NewsNav history={history}>
        <h4>{t('news.news')}</h4>
      </NewsNav>
      <div className="post_page">
        <IframeContainer link={response?.URL || ''} width={width} height={height} />
        <CenteredContent>
          <span>{error}</span>
        </CenteredContent>
        <TagsComponent
          tags={response?.tags}
          wordpressEndpoint={communityQuery.data?.currentCommunity?.wpLink}
        />
        <ShareButton
          url={currentUrl}
          communityName={communityQuery.data?.currentCommunity.name}
          styles={{
            position: 'fixed',
            bottom: 80,
            right: 57
          }}
        />

        <Fab
          variant="extended"
          onClick={handleCommentsView}
          className={`${css(styles.getStartedButton)} `}
          color="primary"
        >
          {t('common:misc.comment', { count: 0 })}{' '}
          <Avatar>{data ? data.postComments.length : 0}</Avatar>
        </Fab>
      </div>
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={handleCommentsView}
          TransitionComponent={Transition}
        >
          <AppBar className={css(styles.appBar)}>
            <Toolbar>
              <IconButton
                edge="start"
                color="primary"
                onClick={handleCommentsView}
                aria-label="close"
                size="large"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6">{t('common:misc.comment', { count: 0 })}</Typography>
            </Toolbar>
          </AppBar>
          <br />
          <br />
          <br />
          {queryResponse.data?.postDiscussion ? (
            <>
              <CenteredContent>
                <h4>
                  {queryResponse.data.postDiscussion.title} {t('news.post_discussion')}
                </h4>
              </CenteredContent>
              <Comments
                comments={data.postComments}
                refetch={refetch}
                discussionId={queryResponse.data.postDiscussion.id}
              />
              {data?.postComments.length >= limit && (
                <CenteredContent>
                  <Button variant="outlined" color="primary" onClick={fetchMoreComments}>
                    {isLoading ? <Spinner /> : t('news.load_more_comments')}
                  </Button>
                </CenteredContent>
              )}
            </>
          ) : (
            <CenteredContent>
              <br />
              {authState.loggedIn && authState.user.userType === 'admin' ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => createDiscussion(response?.title, response?.ID)}
                  disabled={isLoading}
                >
                  {t('news.create_discussion')}
                </Button>
              ) : (
                t('news.discussion_disabled')
              )}
            </CenteredContent>
          )}
        </Dialog>
      </div>
    </>
  );
}
