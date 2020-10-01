import React, { useState } from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import { Link, useParams } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { Pagination } from '@material-ui/lab'
import PostItem from '../../components/NewsPage/PostItem'
import { dateToString } from '../../components/DateContainer'
import { useFetch } from '../../utils/customHooks'
import Categories from '../../components/NewsPage/Categories'
import { wordpressEndpoint } from '../../utils/constants'
import Nav from '../../components/Nav'
import { ShareButton } from '../../components/ShareButton'
import { Spinner } from '../../components/Loading'
import { LogSharedPost } from '../../graphql/mutations'
import CenteredContent from '../../components/CenteredContent'

export default function Posts() {
    const { slug } = useParams()
    const slugs = {
      posts: "Post",
      policy: "Policies",
      promos: "Promos",
      resources: "Resources"
    }
    const [page, setPageNumber] = useState(1)
    const limit = 20
    // const { response, error } = useFetch(`${wordpressEndpoint}/posts/?number=`)
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
    console.log(response.found)
    return (
      <>
        <Nav navName="Nkwashi News" menuButton="back" backTo="/" />
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
            {response.found ? response.posts.map(post => (
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
          <CenteredContent>
            <Pagination count={Math.floor(response.found / limit)} page={page} onChange={handlePageChange} />
          </CenteredContent>
        </div>
        <ShareButton url={currentUrl} doOnShare={onPostsShare} />
      </>
    )

}
