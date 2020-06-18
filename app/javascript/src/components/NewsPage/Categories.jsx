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

    )
}