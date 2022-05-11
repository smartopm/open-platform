/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Grid, Typography } from '@mui/material';
import { StyleSheet, css } from 'aphrodite';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useTheme } from '@mui/material/styles';
import { CommunityNewsPostsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../../shared/CenteredContent';
import Avatar from '../Avatar';
import { formatError } from '../../utils/helpers';
import ImageAuth from '../../shared/ImageAuth';
import PostCreate from '../../modules/Dashboard/Components/PostCreate';
import CardWrapper from '../../shared/CardWrapper';

export default function CommunityNews({ userType, userImage, dashboardTranslation }) {
  const limit = 4;
  const isMobile = useMediaQuery('(max-width:800px)');
  const history = useHistory();
  const theme = useTheme();

  const { loading, error, data, refetch } = useQuery(CommunityNewsPostsQuery, {
    variables: { limit }
  });

  const { t } = useTranslation('discussion');

  const discussionId = data?.communityNewsPosts[0]?.discussionId;

  function redirectToDiscussionsPage() {
    history.push(`/discussions/${discussionId}`);
  }

  if (loading) return <Spinner />;
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  return (
    <div
      className="container"
      style={isMobile ? { padding: '20px' } : { padding: '20px 57px 20px 79px', width: '99%' }}
    >
      <CardWrapper
        title={t('headers.community_news_header')}
        buttonName={t('common:misc.see_more_discussion')}
        displayButton={data?.communityNewsPosts?.length > 0}
        handleButton={redirectToDiscussionsPage}
      >
        <Grid container>
          <Grid item xs={12} style={{ marginBottom: 10 }}>
            {userType !== 'security_guard' && (
              <PostCreate
                translate={dashboardTranslation}
                currentUserImage={userImage}
                btnBorderColor={theme.palette.secondary.main}
                refetchNews={refetch}
                isMobile={isMobile}
              />
            )}
          </Grid>

          {data?.communityNewsPosts?.length >= 1 ? (
            data?.communityNewsPosts?.map(post => (
              <Grid item xs={12} key={post.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar style={{ marginRight: 8 }}>
                    <Avatar user={post.user} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography component="span" variant="subtitle2">
                          {post.user.name}
                        </Typography>
                        <Typography component="p" variant="body2" style={{ color: '#575757' }}>
                          {moment(post.createdAt).fromNow()}
                        </Typography>
                      </>
                    }
                    secondary={
                      <>
                        <span data-testid="community_news_post_author_avatar">
                          {// eslint-disable-next-line react/prop-types
                          post?.imageUrls?.length >= 1 && (
                            <ImageAuth
                              imageLink={post?.imageUrls[0]}
                              style={{
                                marginTop: '15px',
                                marginLeft: '-65px'
                              }}
                            />
                          )}
                        </span>

                        <Typography
                          variant="body2"
                          data-testid="task_body"
                          component="span"
                          className={css(styles.postContentEllipsed)}
                        >
                          {post.content}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </Grid>
            ))
          ) : (
            <CenteredContent>{t('common:misc.first_to_post')}</CenteredContent>
          )}
        </Grid>
      </CardWrapper>
    </div>
  );
}

const styles = StyleSheet.create({
  deleteBtn: {
    marginBottom: 5
  },
  postContentEllipsed: {
    overflow: 'hidden',
    whiteSpace: 'normal',
    textOverflow: 'ellipsis',
    paddingLeft: '3px',
    paddingTop: '5px',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    ' -webkit-line-clamp': '3 !important',
    marginLeft: '-65px'
  },
  postContentVisible: {
    width: '100%',
    overflow: 'visible'
  },
  imageStyles: {
    marginTop: '15px',
    marginLeft: '-65px'
  }
});

CommunityNews.propTypes = {
  dashboardTranslation: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired
};
