import React from 'react'
import { Grid, Box, Button } from '@material-ui/core'
import { useFetch } from '../../utils/customHooks'
import { wordpressEndpoint } from '../../utils/constants'
import { Link } from 'react-router-dom'

export default function Categories() {
    const { response, error } = useFetch(`${wordpressEndpoint}/categories`)
    // TODO: @olivier ==> add better error page and loading component here
    if (error) {
        return error
    }
    if (!response || !response.found) {
        return 'loading'
    }
<<<<<<< HEAD
    return (

        <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
            <Grid >
                <Grid item xs >
                    {response.categories.map(category => (
                        <Button key={category.ID}>
                            <Link stytle={{textDecoration: 'none'}} to={`/spike_news/${category.slug}`}>
                                {category.name}
                            </Link>
                        </Button>
                    ))}
                </Grid>
            </Grid>
        </Box>

=======
    // filter out news categories
    const categories = response.categories.filter(cat => cat.slug !== 'news')

    return (
        <Grid container spacing={3}>
            {
                categories.map(cat => (
                    <Grid key={cat.ID} item xs={6} sm={3}>
                        <Link to={`/spike_news/${cat.slug}`}>{cat.name}</Link>
                    </Grid>
                ))
            }
        </Grid>
>>>>>>> c22cf3e95a55a5973b8ced887152e00d8df18079
    )
}