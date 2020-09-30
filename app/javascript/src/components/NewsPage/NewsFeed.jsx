import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Typography } from '@material-ui/core'
import { useFetch } from '../../utils/customHooks'
import { wordpressEndpoint } from '../../utils/constants'
import { Spinner } from '../Loading'
import CenteredContent from '../CenteredContent'
import { sanitizeText } from '../../utils/helpers'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    flexWrap: 'nowrap'
  },
  title: {
    color: theme.palette.primary.light
  }
}))

export function PostItemGrid({ data }) {
  const classes = useStyles()
  const matches = useMediaQuery('(max-width:600px)')

  function routeToPost(postId) {
    window.location.href = `/news/post/${postId}`
  }
  return (
    <div className={classes.root}>
      <Typography
        align="center"
        color="textSecondary"
        gutterBottom
        variant="h6"
      >
        Latest News
      </Typography>
      <GridList
        className={classes.gridList}
        cols={matches ? 2 : 3}
        spacing={15}
      >
        {data.length &&
          data.map(tile => (
            <GridListTile key={tile.ID} onClick={() => routeToPost(tile.ID)}>
              <img data-testid="tile_image" src={tile.featured_image} alt={tile.title} />
              <GridListTileBar
                title={(
                  // eslint-disable-next-line react/no-danger
                  <span dangerouslySetInnerHTML={{
                  __html: sanitizeText(tile.title)
                }}
                  />
                  )}
                classes={{
                  title: classes.title
                }}
              />
            </GridListTile>
          ))}
      </GridList>
    </div>
  )
}

export default function NewsFeed() {
  const { response, error } = useFetch(`${wordpressEndpoint}/posts`)
  if (error) {
    return (
      <CenteredContent>
        <Typography
          align="center"
          color="textSecondary"
          gutterBottom
          variant="h6"
        >
          {error.message}
        </Typography>
      </CenteredContent>
    )
  }
  if (!response || !response.posts) {
    return <Spinner />
  }
  const data = response.posts?.slice(0, 5) || []
  return <PostItemGrid data={data} />
}
