/* eslint-disable no-use-before-define */
import React from 'react'
import { Grid, Box } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useFetch } from '../../../utils/customHooks'
import { Spinner } from '../../../shared/Loading'

export default function Categories({ wordpressEndpoint }) {
  const { response, error } = useFetch(`${wordpressEndpoint}/categories`)
  const { t } = useTranslation('news')
  // TODO: @olivier ==> add better error page and loading component here
  if (error) {
    return error.message
  }
  if (!response || !response.found) {
    return <Spinner />
  }
  const cats = response.categories.filter(
    // eslint-disable-next-line func-names
    function(cat) {
      // eslint-disable-next-line react/no-this-in-sfc
      return this.indexOf(cat.name) < 0
    },
    t('news.filtered_categories', { returnObjects: true })
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

Categories.propTypes = {
  wordpressEndpoint: PropTypes.string.isRequired
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
