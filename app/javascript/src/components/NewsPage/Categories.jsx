import React, {useContext} from 'react'
import { Grid, Box, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useFetch } from '../../utils/customHooks'
import { wordpressEndpoint } from '../../utils/constants'
import { Spinner } from '../Loading'
import { Context as ThemeContext } from '../../../Themes/Nkwashi/ThemeProvider'

export default function Categories() {
    const { response, error } = useFetch(`${wordpressEndpoint}/categories`)
    const theme = useContext(ThemeContext)
    // TODO: @olivier ==> add better error page and loading component here
    if (error) {
        return error.message
    }
    if (!response || !response.found) {
        return <Spinner />
    }
    const cats = response.categories.filter(cat => cat.slug !== 'private')
    
    return (
      <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
        <Grid>
          <Grid item xs>
            {cats.filter(cat => cat.name !== "news" && cat.name !== "Uncategorized").map(category => (
              <Button key={category.ID}>
                <Link stytle={{color: theme.primaryColor}} to={`/news/${category.slug}`}>
                  {category.name}
                </Link>
              </Button>
                    ))}
          </Grid>
        </Grid>
      </Box>

    )
}