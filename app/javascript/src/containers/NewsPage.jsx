import React from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import backgroundImage from '../../../assets/images/news_background.jpg'
import PostiItem from '../components/NewsPage/PostiItem'
import { dateToString } from '../components/DateContainer'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../utils/customHooks'
import Categories from '../components/NewsPage/Categories'
import { wordpressEndpoint } from '../utils/constants'
import { titleCase } from '../utils/helpers'

export default function NewsPage() {
    const {slug} = useParams()
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=${slug || ''}`)
    // TODO: @olivier ==> add better error page and loading component here
    if (error) {
        return error
    }
    if (!response) {
        return 'loading'
    }
    return (
        <React.Fragment>
            <Categories />
            <div style={{ flex: 1, height: '100vh', width: '100%', overflowX: 'auto' }} >
                <Box style={{ height: '50%', width: '100%', backgroundImage: `url(${backgroundImage})` }} />
                <br />
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h3' color='textSecondary'>
                        {titleCase(slug || 'Posts')}
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
