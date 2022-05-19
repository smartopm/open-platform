/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Typography,
  IconButton
} from '@mui/material';
import { StyleSheet, css } from 'aphrodite';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import Divider from '@mui/material/Divider';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useTheme } from '@mui/material/styles';
import { CommunityNewsPostsQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import Avatar from '../../../components/Avatar';
import { formatError } from '../../../utils/helpers';
import ImageAuth from '../../../shared/ImageAuth';
import PostCreate from '../../Dashboard/Components/PostCreate';
import CardWrapper from '../../../shared/CardWrapper';
import MenuList from '../../../shared/MenuList';

export default function CommunityNews({
  userType,
  userImage,
  userPermissions,
  dashboardTranslation
}) {
  const limit = 4;
  const isMobile = useMediaQuery('(max-width:800px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [postData, setPostData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const anchorElOpen = Boolean(anchorEl);
  const history = useHistory();
  const theme = useTheme();

  const { loading, error, data, refetch } = useQuery(CommunityNewsPostsQuery, {
    variables: { limit }
  });

  const { t } = useTranslation('discussion');

  const discussionId = data?.communityNewsPosts[0]?.discussionId;
  const menuList = [{ content: 'Edit Post', isAdmin: true, color: '', handleClick: () => setEditModal(true) }];

  const menuData = {
    menuList,
    handleMenu,
    anchorEl,
    open: anchorElOpen,
    handleClose
  };

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
  }

  function handleMenu(event, post) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setPostData(post);
  }

  function redirectToDiscussionsPage() {
    history.push(`/discussions/${discussionId}`);
  }

  if (loading) return <Spinner />;
  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  return (
    <div style={isMobile ? { padding: '20px' } : { padding: '20px 20px 20px 79px', width: '99%' }}>
      <CardWrapper
        title={t('headers.community_news_header')}
        buttonName={t('common:misc.see_more_discussion')}
        displayButton={data?.communityNewsPosts?.length >= limit}
        handleButton={redirectToDiscussionsPage}
      >
        {console.log(postData)}
        <Grid container>
          <Grid item xs={12} style={{ marginBottom: 10 }}>
            {userType !== 'security_guard' && (
              <PostCreate
                translate={dashboardTranslation}
                currentUserImage={userImage}
                userPermissions={userPermissions}
                btnBorderColor={theme.palette.secondary.main}
                refetchNews={refetch}
                isMobile={isMobile}
                postData={postData}
                setPostData={setPostData}
                editModal={editModal}
                setEditModal={setEditModal}
                setAnchorEl={setAnchorEl}
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
                      <Grid container>
                        <Grid item md={6} xs={10}>
                          <Typography component="span" variant="subtitle2">
                            {post.user.name}
                          </Typography>
                          <Typography component="p" variant="caption" style={{ color: '#575757' }}>
                            {moment(post.createdAt).fromNow()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Grid>
                <Grid
                  item
                  xs={12}
                  data-testid="community_news_post_author_avatar"
                  style={{ padding: '0 16px' }}
                >
                  {// eslint-disable-next-line react/prop-types
                  post?.imageUrls?.length >= 1 && (
                    <ImageAuth
                      imageLink={post?.imageUrls[0]}
                      style={{
                        width: '100%',
                        marginBottom: '10px',
                        border: 'none',
                        boxShadow: 'none',
                        padding: 0,
                        borderRadius: 0
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} style={{ padding: '0 16px 0 16px' }}>
                  <Typography
                    variant="body2"
                    data-testid="task_body"
                    component="span"
                    className={css(styles.postContentEllipsed)}
                  >
                    {post.content}
                  </Typography>
                  <Divider style={{ margin: '25px 0 16px 0px' }} />
                </Grid>
                        
                    }
                  />
                <Divider style={{ margin: '16px 0' }} />
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
    whiteSpace: 'normal',
    display: '-webkit-box',
    ' -webkit-line-clamp': '3 !important'
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
  userPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  userImage: PropTypes.string.isRequired
};
