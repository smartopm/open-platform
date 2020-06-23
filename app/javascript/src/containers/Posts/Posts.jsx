import React from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import PostiItem from '../../components/NewsPage/PostiItem'
import { dateToString } from '../../components/DateContainer'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../../utils/customHooks'
import Categories from '../../components/NewsPage/Categories'
import { wordpressEndpoint } from '../../utils/constants'
import { titleCase } from '../../utils/helpers'
import Nav from '../../components/Nav'
import {ShareButton} from '../../components/ShareButton'

export default function Posts() {
    const {slug} = useParams()
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=${slug || ''}`)
    const currentUrl = window.location.href
    // TODO: @olivier ==> add better error page and loading component here
    if (error) {
        return error
    }
    if (!response) {
        return 'loading'
    }
    return (
        <React.Fragment>
            <Nav  navName="News" menuButton="back" backTo="/nkwashi_news" />
            <Categories />
            <div style={{ flex: 1, height: '100vh', width: '100%', overflowX: 'auto' }} >
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
                        <Grid item  key={post.ID}>
                            <Box style={{display: 'flex', justifyContent: 'flex-start'}}>
                                <Link key={post.ID} style={{ textDecoration: 'none' }}
                                    to={`/nkwashi_news/post/${post.ID}`}
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

            <ShareButton url={currentUrl} />
        </React.Fragment >
    )

}
