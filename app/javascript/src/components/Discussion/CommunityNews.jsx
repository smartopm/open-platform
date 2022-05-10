/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Button, Grid, Typography } from '@mui/material';
import { StyleSheet, css } from 'aphrodite';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { CommunityNewsPostsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CenteredContent from '../../shared/CenteredContent';
import Avatar from '../Avatar';
import { formatError } from '../../utils/helpers';
import ImageAuth from '../../shared/ImageAuth';

export default function CommunityNews() {
  const limit = 4;
  const largerScreens = useMediaQuery('(min-width:1536)');
  const isMobile = useMediaQuery('(max-width:800px)');
  const history = useHistory();
  const { loading, error, data } = useQuery(CommunityNewsPostsQuery, {
    variables: { limit }
  });

  const { t } = useTranslation('discussion');

  function redirectToDiscussionsPage() {
    history.push('/discussions');
  }

  if (loading) return <Spinner />;
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  return (
    <div className="container" style={{ marginLeft: isMobile ? 5 : 25 }}>
      <Grid container spacing={1} style={{ justifyContent: 'center' }}>
        <Grid item xs={12}>
          <Typography data-testid="disc_title" variant="h5" style={{ marginLeft: 25 }}>
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
                        <div>
                          <span data-testid="comment">
                            <br />
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
                            component="p"
                            className={css(styles.postContentEllipsed)}
                            id="postContent"
                          >
                            {post.content}
                          </Typography>
                        </div>
                      </>
                    }
                  />
                </ListItem>
              </Grid>
              <Divider />
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
              paddingLeft: largerScreens ? 350 : isMobile ? 40 : 200
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
