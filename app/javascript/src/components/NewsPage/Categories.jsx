/* eslint-disable no-use-before-define */
import React from 'react'
import { Grid, Box } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router-dom'
import { useFetch } from '../../utils/customHooks'
import { wordpressEndpoint } from '../../utils/constants'
import { Spinner } from '../Loading'

export default function Categories() {
  const { response, error } = useFetch(`${wordpressEndpoint}/categories`)
  // TODO: @olivier ==> add better error page and loading component here
  if (error) {
    return error.message
  }
  if (!response || !response.found) {
    return <Spinner />
  }
  const cats = response.categories.filter(
    function(cat) {
      // eslint-disable-next-line react/no-this-in-sfc
      return this.indexOf(cat.name) < 0
    },
    ['Private', 'Uncategorized', 'news', 'Nkwashi Digest']
  )
  return (
    <Box
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10
      }}
    >
      <Grid>
        <Grid item xs>
          {cats.map(category => (
            <Link
              data-testid="post_cat"
              to={`/news/${category.slug}`}
              className={`${css(styles.categoryLink)}`}
              key={category.ID}
            >
              {category.name}
            </Link>
          ))}
        </Grid>
      </Grid>
    </Box>
  )
}

const styles = StyleSheet.create({
  categoryLink: {
    marginLeft: '15px',
    ':focus': {
      textDecoration: 'none',
      backgroundColor: '#69ABA4',
      padding: '10px',
      borderRadius: '5px',
      color: 'rgba(0, 0, 0, 0.54)'
    },
    ':hover': {
      textDecoration: 'none'
    }
  }
})
