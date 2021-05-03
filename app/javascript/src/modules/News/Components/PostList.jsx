/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { Pagination } from '@material-ui/lab'
import PropTypes from 'prop-types'
import PostItem from './PostItem'
import { dateToString } from '../../../components/DateContainer'
import { useFetch } from '../../../utils/customHooks'
import Categories from './Categories'
import { ShareButton } from '../../../components/ShareButton'
import { Spinner } from '../../../shared/Loading'
import CenteredContent from '../../../components/CenteredContent'
import { titleize } from '../../../utils/helpers'

export default function PostsList({ wordpressEndpoint }) {
    const { slug } = useParams()
    const [page, setPageNumber] = useState(1)
    
    const limit = 20
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?number=${limit}&page=${page}&category=${slug || ''}`)
    const currentUrl = window.location.href

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
        <Categories wordpressEndpoint={wordpressEndpoint} />
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
        <ShareButton url={currentUrl} />
      </>
    )
}

PostsList.propTypes = {
  wordpressEndpoint: PropTypes.string.isRequired
}