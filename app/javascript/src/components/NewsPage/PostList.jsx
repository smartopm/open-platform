/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { Pagination } from '@material-ui/lab'
import PostItem from './PostItem'
import { dateToString } from '../DateContainer'
import { useFetch } from '../../utils/customHooks'
import Categories from './Categories'
import { wordpressEndpoint } from '../../utils/constants'
import { ShareButton } from '../ShareButton'
import { Spinner } from '../Loading'
import { LogSharedPost } from '../../graphql/mutations'
import CenteredContent from '../CenteredContent'
import { titleize } from '../../utils/helpers'

export default function PostsList() {
    const { slug } = useParams()
    const [page, setPageNumber] = useState(1)
    const limit = 20
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?number=${limit}&page=${page}&category=${slug || ''}`)
    const [logSharedPost] = useMutation(LogSharedPost)
    const currentUrl = window.location.href

    function onPostsShare() {
      logSharedPost({
        variables: { postId: slug || 'posts' }
      })
      .then(res => res)
      .catch(err => console.log(err.message))
    }

    function loadPostPage(postId) {
        window.location.href = `/news/post/${postId}`
      }

    function handlePageChange(_event, value){
      setPageNumber(value)
    }

    if (error) {
        return error.message
    }
    if (!response) {
        return <Spinner />
    }
    const totalPosts = response.found
    const publicPosts = totalPosts && response.posts.filter(post => post.categories.Private == null)
    return (
      <>
        <Box style={{ display: 'flex', justifyContent: 'center', 'marginTop': '7px'}}>
          <Typography variant='h4' color='textSecondary'>
            {titleize(slug || "Posts")}
          </Typography>
        </Box>
        <Categories />
        <div>
          <br />
          <Divider light variant="middle" />
          <br />
          <Grid container direction="row" justify="center">
            {totalPosts ? publicPosts.map(post => (
              <Grid item key={post.ID}>
                <Box style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    key={post.ID}
                    onClick={() => loadPostPage(post.ID)}
                  >
                    <PostItem
                      key={post.ID}
                      title={post.title}
                      imageUrl={post?.featured_image}
                      datePosted={dateToString(post.modified)}
                      subTitle={post.excerpt}
                    />
                  </div>
                </Box>
              </Grid>
                    )) : <p>No Post Found in this category</p>}
          </Grid>
          {
            totalPosts > limit && (
              <CenteredContent>
                <Pagination
                  count={Math.round(totalPosts / limit)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </CenteredContent>
            )
          }
        </div>
        <ShareButton url={currentUrl} doOnShare={onPostsShare} />
      </>
    )
}
