/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Chip from '@material-ui/core/Chip';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types'
import { wordpressEndpoint } from '../../utils/constants'
import { useFetch } from '../../utils/customHooks'
import PostItem from './PostItem'
import { dateToString } from '../DateContainer'

export default function TagPosts({ open, handleClose, tagName }) {
  const classes = useStyles();
  const { response, error } = useFetch(`${wordpressEndpoint}/posts/?tag=${tagName}`)

  if (error) {
    return error.message
  }

  function loadPostPage(postId) {
    window.location.href = `/news/post/${postId}`
  }

  return (
    <>
      <SwipeableDrawer
        anchor='right'
        open={open}
        onClose={handleClose}
        className={classes.root}
      >
        <div
          className={classes.list}
          role="presentation"
        >
          <div className={classes.title}>
            <Typography variant='body1' color='textSecondary'>
              Related Posts
            </Typography>
            <Chip size="small" label={tagName} />
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