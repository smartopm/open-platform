/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
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

const NUMBER_OF_POSTS_TO_DISPLAY = 5
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
        {data.length
        && data.map((tile) => (
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
    return (
      <div style={{margin: '93px 0'}}>
        <Spinner />
      </div>
      )
  }

  return <PostItemGrid data={postsToDisplay(response.posts)} />
}

function postsToDisplay(posts) {
  const data = []
  if (posts && posts.length) {
    const stickyPosts = posts.filter(post => post.sticky).slice(0, NUMBER_OF_POSTS_TO_DISPLAY)
    data.push(...stickyPosts)
    if (stickyPosts.length < NUMBER_OF_POSTS_TO_DISPLAY) {
      const nonStickyPosts = posts.filter(post => !post.sticky)
      const moreToDisplay = nonStickyPosts.slice(0, NUMBER_OF_POSTS_TO_DISPLAY - stickyPosts.length)
      data.push(...moreToDisplay)
    }
  }

  return data
}
