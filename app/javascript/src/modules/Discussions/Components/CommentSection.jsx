import React, { useState } from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import { useTranslation } from 'react-i18next';
import { PostUpdateMutation } from '../../../graphql/mutations';
import { findLinkAndReplace, getObjectKey, sanitizeText } from '../../../utils/helpers';
import Avatar from '../../../components/Avatar';
import DateContainer from '../../../components/DateContainer';
import ImageAuth from '../../../shared/ImageAuth';
import MenuList from '../../../shared/MenuList';
import MessageAlert from '../../../components/MessageAlert';
import DialogWithImageUpload from '../../../shared/dialogs/DialogWithImageUpload';
import { Spinner } from '../../../shared/Loading';
import { accessibilityOptions } from '../../../utils/constants';

export default function CommentSection({ data, handleDeleteComment, refetch }) {
  const { t } = useTranslation(['discussion', 'dashboard']);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [post, setPost] = useState('');
  const [postDetails, setPostDetails] = useState({
    isError: false,
    message: '',
    loading: false
  });
  const [visibilityOption, setVisibilityOption] = useState('Everyone');
  const actionVisibilityOptions = accessibilityOptions;
  const [updatePost] = useMutation(PostUpdateMutation);
  const anchorElOpen = Boolean(anchorEl);
  const menuList = [
    {
      content: t('form_actions.edit_post'),
      isAdmin: true,
      color: '',
      handleClick: () => handleEditClick()
    },
    {
      content: t('form_actions.delete_post'),
      isAdmin: true,
      color: '',
      handleClick: () => handleDeleteComment()
    }
  ];

  const modalDetails = {
    title: t('dashboard:dashboard.edit_post'),
    inputPlaceholder: t('dashboard:dashboard.whats_happening'),
    actionVisibilityOptions,
    actionVisibilityLabel: t('dashboard:dashboard.who_can_see_post'),
    handleVisibilityOptions: option => setVisibilityOption(option),
    visibilityValue: visibilityOption
  };

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

  function handleMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleEditClick() {
    setPost(data.comment);
    if (data.accessibility) {
      setVisibilityOption(actionVisibilityOptions[data.accessibility]);
    }
    setEditModal(true);
  }

  function handleCloseAlert() {
    setPostDetails({ ...postDetails, message: '' });
  }

  function closeCreateModal() {
    setEditModal(false);
    setAnchorEl(null);
    setPost('');
  }

  function handleEditPost() {
    setPostDetails({ ...postDetails, loading: true });

    updatePost({
      variables: {
        content: post,
        id: data.id,
        accessibility: getObjectKey(actionVisibilityOptions, visibilityOption)
      }
    })
      .then(() => {
        setPostDetails({
          ...postDetails,
          loading: false,
          isError: false,
          message: t('dashboard:dashboard.updated_post')
        });
        setPost('');
        closeCreateModal();
        refetch();
      })
      .catch(err => {
        setPostDetails({
          ...postDetails,
          loading: false,
          isError: true,
          message: err.message
        });
        setPost('');
        closeCreateModal();
      });
  }

  return (
    <>
      <MessageAlert
        type={!postDetails.isError ? 'success' : 'error'}
        message={postDetails.message}
        open={!!postDetails.message}
        handleClose={handleCloseAlert}
      />
      <DialogWithImageUpload
        open={editModal}
        handleDialogStatus={closeCreateModal}
        modalDetails={modalDetails}
        observationHandler={{
          value: post,
          handleChange: val => setPost(val)
        }}
        editModal={editModal}
      >
        {postDetails.loading ? (
          <Spinner />
        ) : (
          <>
            <Button disableElevation onClick={closeCreateModal} data-testid="cancel-btn">
              {t('common:form_actions.cancel')}
            </Button>
            <Button
              disabled={!post}
              disableElevation
              onClick={handleEditPost}
              color="primary"
              variant="contained"
              data-testid="post-btn"
              style={{ color: 'white' }}
              autoFocus
            >
              {t('common:misc.post')}
            </Button>
          </>
        )}
      </DialogWithImageUpload>
      <ListItem alignItems="flex-start" data-testid="comment_body">
        <ListItemAvatar style={{ marginRight: 8 }}>
          <Avatar user={data.user} />
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Link
              style={{ cursor: 'pointer', textDecoration: 'none' }}
              to={data.isAdmin ? `/user/${data.user.id}` : '#'}
            >
              <Typography component="span" color="primary">
                {data.user.name}
              </Typography>
            </Link>
          )}
          secondary={(
            <>
              <span data-testid="comment">
                <span
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: sanitizeText(findLinkAndReplace(data.comment))
                  }}
                />
                <br />
                {// eslint-disable-next-line react/prop-types
                data?.imageUrls?.length >= 1 && (
                  <ImageAuth
                    imageLink={data?.imageUrls[0]}
                    className="img-responsive img-thumbnail"
                  />
                )}
              </span>
              <span data-testid="delete_icon" className={css(styles.itemAction)}>
                <DateContainer date={data.createdAt} />
                {data.isAdmin && (
                  <>
                    <IconButton
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      data-testid="post_options"
                      onClick={event => menuData.handleMenu(event)}
                      size="large"
                      component="span"
                    >
                      <MoreVertOutlined />
                    </IconButton>
                    <MenuList
                      open={menuData.open}
                      anchorEl={menuData.anchorEl}
                      handleClose={menuData.handleClose}
                      list={menuData.menuList}
                    />
                  </>
                )}
              </span>
            </>
          )}
        />
      </ListItem>
    </>
  );
}

CommentSection.defaultProps = {
  refetch: () => {}
};

CommentSection.propTypes = {
  data: PropTypes.shape({
    accessibility: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string
  }).isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
  refetch: PropTypes.func
};

const styles = StyleSheet.create({
  timeStamp: {
    float: 'right',
    fontSize: 14,
    color: '#737380'
  },
  actionBtns: {
    marginTop: -29,
    marginLeft: -29
  },
  uploadIcon: {
    cursor: 'pointer'
  },
  itemAction: {
    float: 'right'
  },
  deleteBtn: {
    marginBottom: 5
  }
});
