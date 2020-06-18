import React from 'react'
import { Grid } from '@material-ui/core'
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
        <Grid container spacing={3}>
            {
                response.categories.map(cat => (
                    <Grid key={cat.ID} item xs={6} sm={3}>
                        <Link to={`/spike_news/${cat.slug}`}>{cat.name}</Link>
                    </Grid>
                ))
            }
        </Grid>
    )
}