/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useFetch } from '../../../utils/customHooks';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../components/CenteredContent';

const NUMBER_OF_POSTS_TO_DISPLAY = 5;
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
  },
  image: {
    borderRadius: '8px'
  },
  tile: {
    borderRadius: '8px'
  }
}));

export function PostItemGrid({ data }) {
  const classes = useStyles();
  const { t } = useTranslation('common');
  const matches = useMediaQuery('(max-width:600px)');

  function routeToPost(postId) {
    window.location.href = `/news/post/${postId}`;
  }
  return (
    <div>
      <Typography
        color="textPrimary"
        data-testid="recent_news"
        style={
          matches
            ? { margin: '20px 0 20px 20px', fontSize: '14px', fontWeight: 500, color: '#141414' }
            : { margin: '40px 0 20px 79px', fontWeight: 500, fontSize: '22px', color: '#141414' }
        }
      >
        {t('common:misc.recent_news')}
      </Typography>
      <div
        className={classes.root}
        style={matches ? { margin: '0 20px' } : { margin: '0 79px 26px 79px' }}
      >
        <GridList className={classes.gridList} cols={matches ? 2 : 3.2} spacing={5}>
          {data.length &&
            data.map(tile => (
              <GridListTile
                key={tile.ID}
                onClick={() => routeToPost(tile.ID)}
                style={{ cursor: 'pointer' }}
                classes={{ tile: classes.tile }}
              >
                <img
                  data-testid="tile_image"
                  src={tile.featured_image}
                  alt={tile.title}
                  className={classes.image}
                />
                <GridListTileBar title={tile.title} />
              </GridListTile>
            ))}
        </GridList>
      </div>
    </div>
  );
}

export default function NewsFeed({ wordpressEndpoint }) {
  if (!wordpressEndpoint) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { response, error } = useFetch(`${wordpressEndpoint}/posts`);
  if (error) {
    return (
      <CenteredContent>
        <Typography align="center" color="textSecondary" gutterBottom variant="h6">
          {error.message}
        </Typography>
      </CenteredContent>
    );
  }
  if (!response || !response.posts) {
    return (
      <div style={{ margin: '95px 0' }}>
        <Spinner />
      </div>
    );
  }

  return <PostItemGrid data={postsToDisplay(response.posts)} />;
}

function postsToDisplay(posts) {
  const data = [];
  if (posts && posts.length) {
    const publicPosts = posts.filter(p => p.categories.Private == null);
    const stickyPosts = publicPosts
      .filter(_post => _post.sticky)
      .slice(0, NUMBER_OF_POSTS_TO_DISPLAY);
    data.push(...stickyPosts);
    if (stickyPosts.length < NUMBER_OF_POSTS_TO_DISPLAY) {
      const nonStickyPosts = publicPosts.filter(p => !p.sticky);
      const moreToDisplay = nonStickyPosts.slice(
        0,
        NUMBER_OF_POSTS_TO_DISPLAY - stickyPosts.length
      );
      data.push(...moreToDisplay);
    }
  }

  return data;
}

NewsFeed.propTypes = {
  wordpressEndpoint: PropTypes.string.isRequired
};
