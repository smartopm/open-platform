import React, { useState, useContext } from 'react';
import { ListItem, ListItemAvatar, ListItemText, Grid, Typography, IconButton } from '@mui/material';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import { StyleSheet, css } from 'aphrodite';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import { useQuery, useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { CommunityNewsPostsQuery, SystemDiscussionsQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import Avatar from '../../../components/Avatar';
import { formatError } from '../../../utils/helpers';
import ImageAuth from '../../../shared/ImageAuth';
import PostCreate from '../../Dashboard/Components/PostCreate';
import CardWrapper from '../../../shared/CardWrapper';
import MenuList from '../../../shared/MenuList';
import { PostDeleteMutation } from '../../../graphql/mutations';
import DeleteDialogueBox from '../../../shared/dialogs/DeleteDialogue';
import useMomentWithLocale from '../../../shared/hooks/useMomentWithLocale';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function CommunityNews({
  userType,
  userImage,
  userPermissions,
  dashboardTranslation,
  userId
}) {
  const limit = 4;
  const isMobile = useMediaQuery('(max-width:800px)');
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation('discussion');
  const [anchorEl, setAnchorEl] = useState(null);
  const [postData, setPostData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const anchorElOpen = Boolean(anchorEl);
  const [deletePost] = useMutation(PostDeleteMutation);
  const [postDetails, setPostDetails] = useState({
    isError: false,
    message: '',
    loading: false
  });

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const { loading, error, data, refetch } = useQuery(CommunityNewsPostsQuery, {
    variables: { limit }
  });
  const discussionId = data?.communityNewsPosts[0]?.discussionId;
  const {
    loading: systemDiscussionLoading,
    error: systemDiscussionError,
    data: systemDiscussionData
  } = useQuery(SystemDiscussionsQuery);
  let structuredMenuList = [];
  if (!systemDiscussionLoading) {
    structuredMenuList = systemDiscussionData?.systemDiscussions.map(discussion => ({
      content: discussion?.title,
      handleClick: () => history.push(`/discussions/${discussion?.id}`)
    }));
  }
  const moment = useMomentWithLocale();

  const discussionMenuList = [
    ...structuredMenuList,
    {
      content: t('label.more_topics'),
      handleClick: () => history.push('/discussions')
    }
  ];

  const menuList = [
    {
      content: t('form_actions.edit_post'),
      isAdmin: true,
      color: '',
      handleClick: () => setEditModal(true)
    },
    {
      content: t('form_actions.delete_post'),
      isAdmin: true,
      color: '',
      handleClick: () => setOpenModal(true)
    }
  ];

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

  function handleDeleteClick() {
    setOpenModal(!openModal);
  }

  function handleDeleteComment() {
    deletePost({
      variables: { id: postData.id }
    })
      .then(() => {
        refetch();
        setOpenModal(!openModal);
        showSnackbar({ type: messageType.success, message: t('messages.delete_post') });
        setPostDetails({ ...postDetails, loading: false })
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: err.message, });
        setPostDetails({ ...postDetails, loading: false })
      });
  }

  function redirectToDiscussionsPage() {
    history.push(`/discussions/${discussionId}`);
  }

  if (loading || systemDiscussionLoading) return <Spinner />;
  if (error || systemDiscussionError) {
    return (
      <CenteredContent>
        {formatError(error?.message || systemDiscussionError?.message)}
      </CenteredContent>
    );
  }

  return (
    <div style={isMobile ? {} : { width: '99%' }}>
      <DeleteDialogueBox
        open={openModal}
        handleClose={handleDeleteClick}
        handleAction={handleDeleteComment}
        title={t('common:misc.post')}
      />
      <CardWrapper
        title={t('headers.community_news_header')}
        buttonName={t('common:misc.see_more_discussion')}
        displayButton={data?.communityNewsPosts?.length >= limit}
        handleButton={redirectToDiscussionsPage}
        menuItems={discussionMenuList}
      >
        <Grid container>
          <Grid item xs={12} style={{ marginBottom: 10 }}>
            {userType === 'admin' && (
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
              <div key={post.id} style={{ width: '100%' }}>
                <Grid item xs={12}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar style={{ marginRight: 8 }}>
                      <Avatar user={post.user} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={(
                        <Grid container>
                          <Grid item md={6} xs={10}>
                            <Typography component="span" variant="subtitle2">
                              {post.user.name}
                            </Typography>
                            <Typography
                              component="p"
                              variant="caption"
                              style={{ color: '#575757' }}
                            >
                              {moment(post.createdAt).fromNow()}
                            </Typography>
                          </Grid>
                          {(userId === post.user.id || userType === 'admin') && (
                            <Grid item md={6} xs={2} style={{ textAlign: 'right' }}>
                              <IconButton
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                data-testid="post_options"
                                dataid={post.id}
                                onClick={event => menuData.handleMenu(event, post)}
                                size="large"
                                component="span"
                              >
                                <MoreVertOutlined />
                              </IconButton>
                              <MenuList
                                open={menuData.open && anchorEl.getAttribute('dataid') === post.id}
                                anchorEl={menuData.anchorEl}
                                handleClose={menuData.handleClose}
                                list={menuData.menuList}
                              />
                            </Grid>
                          )}
                        </Grid>
                      )}
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
              </div>
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

CommunityNews.defaultProps = {
  userImage: null
}

CommunityNews.propTypes = {
  dashboardTranslation: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  userImage: PropTypes.string,
  userId: PropTypes.string.isRequired
};
