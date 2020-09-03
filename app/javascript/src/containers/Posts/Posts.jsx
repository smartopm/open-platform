/* eslint-disable */
import React from 'react'
import { Helmet } from "react-helmet";
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import PostItem from '../../components/NewsPage/PostItem'
import { dateToString } from '../../components/DateContainer'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../../utils/customHooks'
import Categories from '../../components/NewsPage/Categories'
import { wordpressEndpoint } from '../../utils/constants'
import { titleCase } from '../../utils/helpers'
import Nav from '../../components/Nav'
import { ShareButton } from '../../components/ShareButton'
import { Spinner } from '../../components/Loading'

export default function Posts() {
    const { slug } = useParams()
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=${slug || ''}`)
    const currentUrl = window.location.href
    const image = "https://i2.wp.com/doublegdp.wpcomstaging.com/wp-content/uploads/2020/08/20200804_162543.jpg?fit=1008%2C756&ssl=1";

    if (error) {
        return error.message
    }
    if (!response) {
        return <Spinner />
    }
    return (
        <React.Fragment>
            <Helmet>
                <meta property="og:title" content="Post Page" />
                <meta property="og:image" content={image} />
                <meta property="og:description" content="Visit the doubleGDP app to see exciting and interesting posts on Nkwashi" />
            </Helmet>
            <Nav navName="News" menuButton="back" backTo="/news" />
            <Categories />
            <div>
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
                        <Grid item key={post.ID}>
                            <Box style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Link key={post.ID} style={{ textDecoration: 'none' }}
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
                    )) : <p>No Post Found in this category</p>
                    }
                </Grid>
            </div>

            <ShareButton url={currentUrl} />
        </React.Fragment >
    )

}
