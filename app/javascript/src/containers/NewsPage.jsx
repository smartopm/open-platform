import React from 'react'
import { Typography, Box, Divider, Grid } from '@material-ui/core'
import backgroundImage from '../../../assets/images/news_background.jpg'
import PostiItem from '../components/NewsPage/PostiItem'
import { newCatDate } from '../components/DateContainer'
import { Link } from 'react-router-dom'

export default function NewsPage() {
    const [data, setData] = React.useState([])
    React.useEffect(() => {
        getPosts()
    }, [])
    const getPosts = async () => {
        const res = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/realatorblog.wordpress.com/posts')
        const da = await res.json()
        setData(da.posts)
    }

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
                    {data.map(post => (
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
                                        datePosted={newCatDate(post.modified)}
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
