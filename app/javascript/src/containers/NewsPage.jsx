import React from 'react'
import { Typography, Box, Divider, Grid, Button } from '@material-ui/core'
import backgroundImage from '../../../assets/images/news_background.jpg'
import PostiItem from '../components/NewsPage/PostiItem'
import { dateToString } from '../components/DateContainer'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../utils/customHooks'
import Categories from '../components/NewsPage/Categories'
import { wordpressEndpoint } from '../utils/constants'
import { titleCase } from '../utils/helpers'
import Nav from '../components/Nav'

export default function NewsPage() {
    const {slug} = useParams()
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=${slug}`)
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
                <Nav />
                <Box style={{ height: '50%', width: '100%', backgroundImage: `url(${backgroundImage})` }} />
                <Categories />
                <br />
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h3' color='textSecondary'>
                        {titleCase(slug)}
                    </Typography>
                </Box>
                <Divider light variant="middle" />
                <br />
                <Grid container direction="row" justify="center">
                    {response.found ? response.posts.map(post => (
                        <Grid item xs key={post.ID}>
                            <Box style={{display: 'flex', justifyContent: 'center'}}>
                                <Link key={post.ID} style={{ textDecoration: 'none' }}
                                    to={`/spike_news/post/${post.ID}`}
                                >
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
                    )) : <p>No Post Found in this category</p>
                    }
                </Grid>
            </div>
        </React.Fragment >
    )

}
