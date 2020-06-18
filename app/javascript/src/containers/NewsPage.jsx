import React from 'react'
import { Typography, Box, Divider, Grid, Button } from '@material-ui/core'
import backgroundImage from '../../../assets/images/news_background.jpg'
import PostiItem from '../components/NewsPage/PostiItem'
import { newCatDate } from '../components/DateContainer'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'

export default function NewsPage() {
    const [data, setData] = React.useState([])
    const [categorys, setCategory] = React.useState([])
    React.useEffect(() => {
        getPosts()
        getCategory()
    }, [])
    const getPosts = async () => {
        const res = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/posts')
        const da = await res.json()
        setData(da.posts)
    }
    const getCategory = async () => {

        const res = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/categories')
        const da = await res.json()
        setCategory(da.categories)
    }

    return (
        <React.Fragment>
            <div style={{ flex: 1, height: '100vh', width: '100%', overflowX: 'auto' }} >
                <Nav />

                <Box style={{ height: '50%', width: '100%', backgroundImage: `url(${backgroundImage})` }} />
                <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                    <Grid direction="row" justify="flex-end">
                        <Grid item xs >
                            {categorys.map(category => (
                                <Button>
                                    {category.name}
                                </Button>
                            ))}
                        </Grid>
                    </Grid>
                </Box>
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
                            <Box style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 50 }}>
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
                </Grid>
            </div>
        </React.Fragment >
    )

}
