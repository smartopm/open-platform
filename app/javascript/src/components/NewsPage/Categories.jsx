/* eslint-disable no-use-before-define */
import React, {useContext} from 'react'
import { Grid, Box, Button } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
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
    const cats = response.categories.filter(cat => cat.slug !== 'private' && cat.name !== "Uncategorized" && cat.name !== "news")
    return (
      <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
        <Grid>
          <Grid item xs>
            {cats.map(category => (
              <Button style={{color: theme.primaryColor}} className={`${css(styles.categoryButton)}`} key={category.ID}>
                <Link data-testid="post_cat" to={`/news/${category.slug}`} className={`${css(styles.categoryLink)}`}>
                  {category.name}
                </Link>
              </Button>
                ))}
          </Grid>
        </Grid>
      </Box>
    )
}

const styles = StyleSheet.create({
  categoryLink: {
    ':hover': {
      textDecoration: 'none',
      backgroundColor: '#69ABA4',
      padding: '5px',
      borderRadius: '5px',
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
})
