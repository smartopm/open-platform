/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types'
import { useLazyQuery, useMutation } from 'react-apollo';
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch } from '../../utils/customHooks'
import PostItem from './PostItem'
import { dateToString } from '../DateContainer'
import Tag from './Tag';
import MessageAlert from '../MessageAlert';
import { PostTagUser } from '../../graphql/queries';
import { Spinner } from '../Loading'
import { FollowPostTag } from '../../graphql/mutations';

export default function TagPosts({ open, handleClose, tagName }) {
  const classes = useStyles();
  const { response, error } = useFetch(`${wordpressEndpoint}/posts/?tag=${tagName}`)
  const [messageAlert, setMessageAlert] = useState('')
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [isAlertOpen, setAlertOpen] = useState(false)
  const [loadUserTags, {  called, loading, data, error: lazyError, refetch } ] = useLazyQuery(PostTagUser)
  const [followTag] = useMutation(FollowPostTag)

  useEffect(() => {
      if (open && tagName) {
        loadUserTags({ variables: { tagName } })
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagName, open])

  if (error || lazyError) {
    return error.message || lazyError?.message
  }

  function loadPostPage(postId) {
    window.location.href = `/news/post/${postId}`
  }

  function handleFollowTag(){
    setIsSuccessAlert(true)
    followTag({
      variables: { tagName }
    })
    .then(() => {
      setMessageAlert(`You are ${!data.userTags ? 'now' : 'no longer'} following ${tagName}`)
      setAlertOpen(true)
      refetch()
    })
    .catch(err => {
      setMessageAlert(err.message)
      setAlertOpen(true)
      setIsSuccessAlert(true)
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
        onOpen={() => console.log('')}
      >
        <div
          className={classes.list}
          role="presentation"
        >
          <div className={classes.title}>
            <Typography variant='body1' color='textSecondary'>
              Related Posts
            </Typography>
            <div>
              <Tag tag={tagName || ''} />
              <Button onClick={handleFollowTag} color="primary" style={{ float: 'right' }}>
                {
                  // eslint-disable-next-line no-nested-ternary
                  called && loading ? <Spinner /> : called && data?.userTags !== null ? 'Unfollow Tag' : 'Follow Tag'
                }
              </Button>
            </div>
          </div>
          {response.posts?.map((post) => (
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
}