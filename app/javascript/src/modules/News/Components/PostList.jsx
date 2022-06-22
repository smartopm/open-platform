/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { Box, Grid, Pagination } from '@mui/material';
import { useLocation, useHistory } from 'react-router-dom';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PostItem from './PostItem';
import { dateToString } from '../../../components/DateContainer';
import { useFetch } from '../../../utils/customHooks';

import Categories from './Categories';
import { ShareButton } from '../../../components/ShareButton';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import PageWrapper from '../../../shared/PageWrapper';

export default function PostsList({ wordpressEndpoint, communityName }) {
  const { pathname } = useLocation();
  const [page, setPageNumber] = useState(1);
  const { t } = useTranslation('news');
  const limit = 20;
  const slug = pathname.split('/')[2];
  const { response, error } = useFetch(
    `${wordpressEndpoint}/posts/?number=${limit}&page=${page}&category=${slug || ''}`
  );
  const currentUrl = window.location.href;
  const history = useHistory();

  function loadPostPage(postId) {
    history.push(`/news/post/${postId}`);
  }

  function handlePageChange(_event, value) {
    setPageNumber(value);
  }

  if (error) {
    return <CenteredContent>{t('news.no_posts')}</CenteredContent>;
  }
  if (!response) {
    return <Spinner />;
  }
  const totalPosts = response?.found || 0;
  const publicPosts =
    Boolean(totalPosts) && response.posts.filter(post => post.categories.Private == null);
  return (
    <PageWrapper pageTitle={t('news.news')}>
      <Categories wordpressEndpoint={wordpressEndpoint} />
      <div>
        <Grid container direction="row" justifyContent="center">
          {totalPosts ? (
            publicPosts.map(post => (
              <Grid item key={post.ID}>
                <Box style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div key={post.ID} onClick={() => loadPostPage(post.ID)}>
                    <PostItem
                      key={post.ID}
                      title={post.title}
                      imageUrl={post?.featured_image}
                      datePosted={dateToString(post.modified)}
                      subTitle={post.excerpt}
                    />
                  </div>
                </Box>
              </Grid>
            ))
          ) : (
            <p>{t('news.no_post')}</p>
          )}
        </Grid>
        {totalPosts > limit && (
          <CenteredContent>
            <Pagination
              count={Math.round(totalPosts / limit)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </CenteredContent>
        )}
      </div>
      <ShareButton url={currentUrl} communityName={communityName} />
    </PageWrapper>
  );
}

PostsList.propTypes = {
  wordpressEndpoint: PropTypes.string.isRequired,
  communityName: PropTypes.string.isRequired
};
