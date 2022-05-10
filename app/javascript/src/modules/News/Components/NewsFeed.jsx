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
import { sanitizeText, truncateString } from '../../../utils/helpers'

const NUMBER_OF_POSTS_TO_DISPLAY = 2;
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
          {(loading ? Array.from(new Array(5)) : data.length && data).map((tile, index) =>
            tile ? (
              <Grid item md={6} onClick={() => routeToPost(tile.ID)} className={classes.gridItem}>
                <Card sx={{ width: '100%' }} elevation={0}>
                  <CardMedia
                    component="img"
                    height="194"
                    image={tile.featured_image}
                    alt="Paella dish"
                  />
                  <CardContent>
                    <Typography variant="body1">{tile.title}</Typography>
                    <br />
                    <Typography variant="body2" color="text.secondary">
                      <div
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: sanitizeText(truncateString(tile.excerpt, 200))
                        }}
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index}>
                <CustomSkeleton variant="rectangular" width="100%" height="140px" />
              </div>
            )
          )}
        </Grid>
      </CardWrapper>
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
