/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import PostItem from '../../components/NewsPage/PostItem'
import { dateToString } from '../../components/DateContainer'
import { useFetch } from '../../utils/customHooks'
import Categories from '../../components/NewsPage/Categories'
import { wordpressEndpoint } from '../../utils/constants'
import Nav from '../../components/Nav'
import { ShareButton } from '../../components/ShareButton'
import { Spinner } from '../../components/Loading'
import { LogSharedPost } from '../../graphql/mutations'

export default function Posts() {
    const { slug } = useParams()
    const slugs = {
      posts: "Post",
      policy: "Policies",
      promos: "Promos",
      resources: "Resources"
    }
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=${slug === "posts" ? 'post' : slug || ''}`)
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

    if (error) {
        return error.message
    }
    if (!response) {
        return <Spinner />
    }
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
        </div>

        <ShareButton url={currentUrl} doOnShare={onPostsShare} />
      </>
    )

}
