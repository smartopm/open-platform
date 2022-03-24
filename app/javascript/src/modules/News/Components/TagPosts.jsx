/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types'
import { useLazyQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useFetch } from '../../../utils/customHooks';
import PostItem from './PostItem'
import { dateToString } from '../../../components/DateContainer'
import Tag from './Tag';
import MessageAlert from '../../../components/MessageAlert';
import { PostTagUser } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading'
import { FollowPostTag } from '../../../graphql/mutations';
import CenteredContent from '../../../shared/CenteredContent';

export default function TagPosts({ open, handleClose, tagName, wordpressEndpoint }) {
  const classes = useStyles();
  const { response, error } = useFetch(`${wordpressEndpoint}/posts/?tag=${tagName}`)
  const [messageAlert, setMessageAlert] = useState('')
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [isAlertOpen, setAlertOpen] = useState(false)
  const [mutationLoading, setMutationLoading] = useState(false)
  const [loadUserTags, {  called, loading, data, error: lazyError, refetch } ] = useLazyQuery(PostTagUser)
  const [followTag] = useMutation(FollowPostTag)
  const { t } = useTranslation('news')
  const history = useHistory();

  useEffect(() => {
      if (open && tagName) {
        loadUserTags({ variables: { tagName } })
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagName, open])

  if (error || lazyError) {
    return <CenteredContent>{t('news.no_tags_found') || lazyError?.message}</CenteredContent>
  }

  function loadPostPage(postId) {
    history.push(`/news/post/${postId}`);
  }

  function handleFollowTag(){
    setMutationLoading(true)
    followTag({
      variables: { tagName }
    })
    .then(() => {
      setIsSuccessAlert(true)
      setMessageAlert(!data.userTags ? t('news.following', { tag: tagName }) : t('news.unfollowing', { tag: tagName }))
      setAlertOpen(true)
      setMutationLoading(false)
      refetch()
    })
    .catch(err => {
      setMessageAlert(err.message)
      setAlertOpen(true)
      setIsSuccessAlert(true)
      setMutationLoading(false)
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setAlertOpen(false)
  }
  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={isAlertOpen}
        handleClose={handleMessageAlertClose}
      />
      <SwipeableDrawer
        anchor='right'
        open={open}
        onClose={handleClose}
        className={classes.root}
        // TODO: handle this properly
        onOpen={() => {}}
      >
        <div
          className={classes.list}
          role="presentation"
        >
          <div className={classes.title}>
            <Typography variant='body1' color='textSecondary'>
              {t('news.related_posts')}
            </Typography>
            <div>
              <Tag tag={tagName || ''} />
              <Button onClick={handleFollowTag} disabled={mutationLoading} color="primary" style={{ float: 'right' }} data-testid="follow_btn">
                {
                  // eslint-disable-next-line no-nested-ternary
                  called && loading ? <Spinner /> : called && data?.userTags !== null ? t('news.unfollow_tag') : t('news.follow_tag')
                }
              </Button>
            </div>
          </div>


          { Boolean(response?.posts) && response.posts?.map((post) => (
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
          )
          )}
        </div>
      </SwipeableDrawer>
    </>
  );
}

const useStyles = makeStyles({
  list: {
    width: 400,
  },
  fullList: {
    width: 'auto',
  },
  title: {
    margin: '10px'
  }
});

TagPosts.defaultProps = {
  tagName: ''
}

TagPosts.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  tagName: PropTypes.string,
  wordpressEndpoint: PropTypes.string.isRequired
}
