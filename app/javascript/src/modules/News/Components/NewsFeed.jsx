/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Grid from '@mui/material/Grid';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useFetch } from '../../../utils/customHooks';
import CenteredContent from '../../../components/CenteredContent';
import CustomSkeleton from '../../../shared/CustomSkeleton';

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
    flexWrap: 'nowrap',
    transform: 'translateZ(0)'
  },
  title: {
    color: theme.palette.primary.light
  },
  image: {
    borderRadius: '8px',
    width: '100%'
  },
  tile: {
    borderRadius: '8px'
  }
}));

export function PostItemGrid({ data, loading }) {
  const classes = useStyles();
  const { t } = useTranslation('common');
  const matches = useMediaQuery('(max-width:600px)');
  const history = useHistory();

  function routeToPost(postId) {
    history.push(`/news/post/${postId}`);
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
        <ImageList
          className={classes.gridList}
          cols={matches ? 2 : 3}
          spacing={5}
          sx={{
            gridAutoFlow: 'column',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr)) !important',
            gridAutoColumns: 'minmax(200px, 1fr)'
          }}
        >
          {(loading ? Array.from(new Array(5)) : data.length && data).map((tile, index) => (
            <ImageListItem
              key={tile?.ID || index}
              onClick={tile ? () => routeToPost(tile.ID) : undefined}
              style={tile ? { cursor: 'pointer' } : undefined}
              classes={{ tile: classes.tile }}
            >
              {tile ? (
                <Grid>
                  <img
                    data-testid="tile_image"
                    src={tile.featured_image}
                    alt={tile.title}
                    className={classes.image}
                  />
                  <ImageListItemBar title={tile.title} />
                </Grid>
              ) : (
                <CustomSkeleton variant="rectangular" width="100%" height="140px" />
              )}
            </ImageListItem>
          ))}
        </ImageList>
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

  return (
    <PostItemGrid data={postsToDisplay(response.posts)} loading={!response || !response.posts} />
  );
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
