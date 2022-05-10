/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useContext, useState } from 'react';
import { ListItem, ListItemAvatar, ListItemText, Button, Grid, Typography } from '@mui/material';
import { StyleSheet, css } from 'aphrodite';
import { Link, useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { CommunityNewsPostsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../../shared/CenteredContent';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';
import Avatar from '../Avatar';
import { formatError } from '../../utils/helpers';
import ImageAuth from '../../shared/ImageAuth';

export default function CommunityNews() {
  const limit = 4;
  const authState = useContext(AuthStateContext);
  const [isEllipsis, setIsEllipsis] = useState(false);
  const largerScreens = useMediaQuery('(min-width:1200px)');
  const isMobile = useMediaQuery('(max-width:800px)');
  const history = useHistory();
  const { loading, error, data } = useQuery(CommunityNewsPostsQuery, {
    variables: { limit }
  });

  const { t } = useTranslation('discussion');

  function redirectToDiscussionsPage() {
    history.push('/discussions');
  }

  function seeMorePostContent() {
    setIsEllipsis(!isEllipsis);
  }

  if (loading) return <Spinner />;
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  return (
    <div className="container" style={{ marginLeft: isMobile ? 5 : 25 }}>
      <Grid container spacing={1} style={{ justifyContent: 'center' }}>
        <Grid item xs={12}>
          <Typography data-testid="disc_title" variant="h6" style={{ marginLeft: 25 }}>
            {t('headers.community_news_header')}
          </Typography>
        </Grid>

        {data?.communityNewsPosts.length >= 1 ? (
          data?.communityNewsPosts?.map(post => (
            <>
              <Grid item xs={12}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar style={{ marginRight: 8 }}>
                    <Avatar user={post.user} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        style={{ cursor: 'pointer', textDecoration: 'none' }}
                        to={authState.user.userType === 'admin' ? `/user/${post.user.id}` : '#'}
                      >
                        <Typography component="span" color="primary">
                          {post.user.name}
                        </Typography>
                      </Link>
                    }
                    secondary={
                      // eslint-disable-next-line react/jsx-wrap-multilines
                      <>
                        <div>
                          <span data-testid="comment">
                            <br />
                            {// eslint-disable-next-line react/prop-types
                            post?.imageUrls?.length >= 1 && (
                              <ImageAuth
                                imageLink={post?.imageUrls[0]}
                                className="img-responsive img-thumbnail"
                              />
                            )}
                          </span>

                          <Typography
                            variant="body2"
                            data-testid="task_body"
                            component="p"
                            className={
                              post.content.length >= 50
                                ? css(styles.postContentEllipsed)
                                : css(styles.postContentVisible)
                            }
                            id="postContent"
                          >
                            {post.content}
                          </Typography>
                        </div>
                        {post.content.length >= 50 && (
                          <div>
                            <Grid
                              item
                              xs={12}
                              style={{
                                justifyContent: 'center',
                                // paddingLeft: largerScreens ? 890 : isMobile ? 580 : 0,
                                marginTop: 2
                              }}
                            >
                              <Button
                                color="primary"
                                variant="outlined"
                                onClick={seeMorePostContent}
                                data-testid="load_more_button"
                                disabled={data.isLoading}
                              >
                                {t('common:misc.see_more')}
                              </Button>
                            </Grid>
                          </div>
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Grid>
            </>
          ))
        ) : (
          <p className="text-center">{t('common:misc.first_to_post')}</p>
        )}
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            style={{
              justifyContent: 'center',
              paddingLeft: largerScreens ? 350 : isMobile ? 40 : 100
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={redirectToDiscussionsPage}
              data-testid="load_more_button"
              disabled={data.isLoading}
            >
              {t('common:misc.see_more_discussion')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = StyleSheet.create({
  deleteBtn: {
    marginBottom: 5
  },
  postContentEllipsed: {
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'normal',
    textOverflow: 'ellipsis',
    paddingLeft: '3px',
    paddingTop: '5px',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    ' -webkit-line-clamp': '3 !important'
  },
  postContentVisible: {
    width: '100%',
    overflow: 'visible'
  }
});
