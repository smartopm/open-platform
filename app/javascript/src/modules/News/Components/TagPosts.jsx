/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useFetch } from '../../../utils/customHooks';
import PostItem from './PostItem';
import { dateToString } from '../../../components/DateContainer';
import Tag from './Tag';
import { PostTagUser } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import { FollowPostTag } from '../../../graphql/mutations';
import CenteredContent from '../../../shared/CenteredContent';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function TagPosts({ open, handleClose, tagName, wordpressEndpoint }) {
  const classes = useStyles();
  const { response, error } = useFetch(`${wordpressEndpoint}/posts/?tag=${tagName}`);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [loadUserTags, { called, loading, data, error: lazyError, refetch }] = useLazyQuery(
    PostTagUser
  );
  const [followTag] = useMutation(FollowPostTag);
  const { t } = useTranslation('news');
  const history = useHistory();

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  useEffect(() => {
    if (open && tagName) {
      loadUserTags({ variables: { tagName } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagName, open]);

  if (error || lazyError) {
    return <CenteredContent>{t('news.no_tags_found') || lazyError?.message}</CenteredContent>;
  }

  function loadPostPage(postId) {
    history.push(`/news/post/${postId}`);
  }

  function handleFollowTag() {
    setMutationLoading(true);
    followTag({
      variables: { tagName }
    })
      .then(() => {
        showSnackbar({
          type: messageType.success,
          message: !data.userTags
              ? t('news.following', { tag: tagName })
              : t('news.unfollowing', { tag: tagName })
        });
        setMutationLoading(false);
        refetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: err.message });
        setMutationLoading(false);
      });
  }

  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={handleClose}
        className={classes.root}
        // TODO: handle this properly
        onOpen={() => {}}
      >
        <div className={classes.list} role="presentation">
          <div className={classes.title}>
            <Typography variant="body1" color="textSecondary">
              {t('news.related_posts')}
            </Typography>
            <div>
              <Tag tag={tagName || ''} />
              <Button
                onClick={handleFollowTag}
                disabled={mutationLoading}
                color="primary"
                style={{ float: 'right' }}
                data-testid="follow_btn"
              >
                {// eslint-disable-next-line no-nested-ternary
                called && loading ? (
                  <Spinner />
                ) : called && data?.userTags !== null ? (
                  t('news.unfollow_tag')
                ) : (
                  t('news.follow_tag')
                )}
              </Button>
            </div>
          </div>

          {Boolean(response?.posts) &&
            response.posts?.map(post => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <div key={post.ID} onClick={() => loadPostPage(post.ID)}>
                <PostItem
                  key={post.ID}
                  title={post.title}
                  imageUrl={post?.featured_image}
                  datePosted={dateToString(post.modified)}
                  subTitle={post.excerpt}
                />
              </div>
            ))}
        </div>
      </SwipeableDrawer>
    </>
  );
}

const useStyles = makeStyles({
  list: {
    width: 400
  },
  fullList: {
    width: 'auto'
  },
  title: {
    margin: '10px'
  }
});

TagPosts.defaultProps = {
  tagName: ''
};

TagPosts.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  tagName: PropTypes.string,
  wordpressEndpoint: PropTypes.string.isRequired
};
