/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useFetch } from '../../../utils/customHooks';
import CustomSkeleton from '../../../shared/CustomSkeleton';
import CenteredContent from '../../../shared/CenteredContent';
import CardWrapper from '../../../shared/CardWrapper';
import { sanitizeText, truncateString } from '../../../utils/helpers';
import MediaCard from '../../../shared/MediaCard';
import ControlledCard from '../../../shared/ControlledCard';

const useStyles = makeStyles(() => ({
  gridItem: {
    cursor: 'pointer'
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
    <div style={matches ? { padding: '20px' } : { padding: '20px 57px 20px 79px', width: '99%' }}>
      <CardWrapper
        title={t('misc.recent_article')}
        buttonName={t('misc.see_more_articles')}
        displayButton={data.length > 0}
        handleButton={() => history.push('/news')}
      >
        <Grid container spacing={4}>
          {(loading ? Array.from(new Array(5)) : data.length && data).map((tile, index) => (
            <div key={tile.ID}>
              {tile ? (
                !matches ? (
                  <Grid
                    item
                    md={6}
                    onClick={() => routeToPost(tile.ID)}
                    className={classes.gridItem}
                  >
                    <Card sx={{ width: '100%' }} elevation={0}>
                      <CardMedia
                        component="img"
                        height="194"
                        image={tile.featured_image}
                        alt={tile.title}
                        data-testid="tile_image"
                      />
                      <CardContent>
                        <Typography variant="body1">{tile.title}</Typography>
                        <br />
                        <Typography variant="body2" color="text.secondary" component="div">
                          <div
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: sanitizeText(truncateString(tile.excerpt, 190))
                            }}
                          />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : index === 0 ? (
                  <Grid
                    item
                    xs={12}
                    onClick={() => routeToPost(tile.ID)}
                    className={classes.gridItem}
                  >
                    <MediaCard
                      title={tile.title}
                      subtitle={tile.excerpt}
                      imageUrl={tile.featured_image}
                    />
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    onClick={() => routeToPost(tile.ID)}
                    className={classes.gridItem}
                  >
                    <ControlledCard subtitle={tile.excerpt} imageUrl={tile.featured_image} />
                  </Grid>
                )
              ) : (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index}>
                  <CustomSkeleton variant="rectangular" width="100%" height="140px" />
                </div>
              )}
            </div>
          ))}
        </Grid>
      </CardWrapper>
    </div>
  );
}

export default function NewsFeed({ wordpressEndpoint }) {
  const matches = useMediaQuery('(max-width:600px)');
  const NUMBER_OF_POSTS_TO_DISPLAY = matches ? 3 : 2;
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
    <PostItemGrid
      data={postsToDisplay(response.posts, NUMBER_OF_POSTS_TO_DISPLAY)}
      loading={!response || !response.posts}
    />
  );
}

function postsToDisplay(posts, number) {
  const data = [];
  if (posts && posts.length) {
    const publicPosts = posts.filter(p => p.categories.Private == null);
    const stickyPosts = publicPosts.filter(_post => _post.sticky).slice(0, number);
    data.push(...stickyPosts);
    if (stickyPosts.length < number) {
      const nonStickyPosts = publicPosts.filter(p => !p.sticky);
      const moreToDisplay = nonStickyPosts.slice(0, number - stickyPosts.length);
      data.push(...moreToDisplay);
    }
  }

  return data;
}

NewsFeed.propTypes = {
  wordpressEndpoint: PropTypes.string.isRequired
};
