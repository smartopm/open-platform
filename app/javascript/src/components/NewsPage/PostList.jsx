import React, { useState } from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import { Link, useParams } from 'react-router-dom'
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

export default function PostsList() {
    const { slug } = useParams()
    const slugs = {
      posts: "Post",
      policy: "Policies",
      promos: "Promos",
      resources: "Resources"
    }
    const [page, setPageNumber] = useState(1)
    const limit = 20
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?number=${limit}&page=${page}&category=${slug === "posts" ? 'post' : slug || ''}`)
    const [logSharedPost] = useMutation(LogSharedPost)
    const currentUrl = window.location.href

    function onPostsShare() {
      logSharedPost({
        variables: { postId: slug || 'posts' }
      })
      .then(res => res)
      .catch(err => console.log(err.message))
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
    return (
      <>
        <Box style={{ display: 'flex', justifyContent: 'center', 'marginTop': '7px'}}>
          <Typography variant='h4' color='textSecondary'>
            {slugs[slug] === "Post" && "Posts" || slug === "artists-in-residence"
            && "Artist in Residence"
            || slugs[slug] || "Posts"}
          </Typography>
        </Box>
        <Categories />
        <div>
          <br />
          <Divider light variant="middle" />
          <br />
          <Grid container direction="row" justify="center">
            {totalPosts ? response.posts.map(post => (
              <Grid item key={post.ID}>
                <Box style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Link
                    key={post.ID}
                    style={{ textDecoration: 'none' }}
                    to={`/news/post/${post.ID}`}
                  >
                    <PostItem
                      key={post.ID}
                      title={post.title}
                      imageUrl={post?.featured_image}
                      datePosted={dateToString(post.modified)}
                      subTitle={post.excerpt}
                    />
                  </Link>
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
