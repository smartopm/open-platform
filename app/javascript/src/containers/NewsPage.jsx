import React from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import backgroundImage from '../../../assets/images/news_background.jpg'
import PostiItem from '../components/NewsPage/PostiItem'
import { dateToString } from '../components/DateContainer'
import { Link } from 'react-router-dom'
import { useFetch } from '../utils/customHooks'

export default function NewsPage() {
    const {response, error} = useFetch('https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/posts', {})
    
    if (error) {
        return error
    }
    if (!response) {
        return 'loading'
    }
    console.log(response)
    return (
        <React.Fragment>
            <div style={{ flex: 1, height: '100vh', width: '100%', overflowX: 'auto' }} >
                <Box style={{ height: '50%', width: '100%', backgroundImage: `url(${backgroundImage})` }} />
                <br />
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h3' color='textSecondary'>
                        Posts
                    </Typography>
                </Box>
                <Divider light variant="middle" />
                <br />
                <Grid container direction="row" justify="center">
                    {response.posts.map(post => (
                        <Grid item xs key={post.ID}>
                            <Box style={{display: 'flex', justifyContent: 'center'}}>
                                <Link key={post.ID} style={{ textDecoration: 'none' }} to={{
                                    pathname: "/spike_news/post",
                                    state: {
                                        title: post.title,
                                        imageUrl: post.featured_image,
                                        content: post.excerpt
                                    }
                                }} >
                                    <PostiItem
                                        key={post.ID}
                                        title={post.title}
                                        imageUrl={post.featured_image}
                                        datePosted={dateToString(post.modified)}
                                        subTitle={post.excerpt}
                                    />
                                </Link>
                            </Box>
                        </Grid>
                    ))
                    }
                    {/* <Box style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }} >
                    </Box> */}
                </Grid>
            </div>
        </React.Fragment >
    )

}
