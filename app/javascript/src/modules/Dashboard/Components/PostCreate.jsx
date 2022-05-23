import React, { useState, useEffect } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';
import { Button, Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import DialogWithImageUpload from '../../../shared/dialogs/DialogWithImageUpload';
import useFileUpload from '../../../graphql/useFileUpload';
import { PostCreateMutation, PostUpdateMutation } from '../../../graphql/mutations';
import MessageAlert from '../../../components/MessageAlert';
import { Spinner } from '../../../shared/Loading';
import { objectAccessor } from '../../../utils/helpers';

export default function PostCreate({
  translate,
  currentUserImage,
  userPermissions,
  btnBorderColor,
  refetchNews,
  postData,
  editModal,
  setPostData,
  setEditModal,
  setAnchorEl
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [post, setPost] = useState('');

  const modulePermission = userPermissions.find(mod => mod.module === 'discussion')?.permissions;
  const permissions = new Set(modulePermission);

  const [visibilityOption, setVisibilityOption] = useState(permissions.has('can_set_accessibility') ? 'Everyone' : null);
  const [imageUrls, setImageUrls] = useState([]);
  const [blobIds, setBlobIds] = useState([]);
  const [postDetails, setPostDetails] = useState({
    isError: false,
    message: '',
    loading: false
  });

  const { onChange, signedBlobId, url, status } = useFileUpload({
    client: useApolloClient()
  });

  const [createPost] = useMutation(PostCreateMutation);
  const actionVisibilityOptions = {
    admins: 'Admins Only',
    everyone: 'Everyone'
  };
  const [updatePost] = useMutation(PostUpdateMutation);
  const modalDetails = {
    title: editModal ? translate('dashboard.edit_post') : translate('dashboard.start_post'),
    inputPlaceholder: translate('dashboard.whats_happening'),
    uploadBtnText: translate('dashboard.add_photo')
  };

  if (permissions.has('can_set_accessibility')) {
    modalDetails.actionVisibilityOptions = actionVisibilityOptions;
    modalDetails.actionVisibilityLabel = translate('dashboard.who_can_see_post');
    modalDetails.handleVisibilityOptions = option => setVisibilityOption(option);
    modalDetails.visibilityValue = visibilityOption;
  }

  useEffect(() => {
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url]);
      setBlobIds([...blobIds, signedBlobId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (editModal) {
      setPost(postData.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editModal]);

  function handleCloseButton(imgUrl) {
    const images = [...imageUrls];
    const filteredImages = images.filter(img => img !== imgUrl);
    setImageUrls(filteredImages);
  }

  function resetImageData() {
    setImageUrls([]);
    setBlobIds([]);
  }

  function openCreateModal() {
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    if (editModal) {
      setEditModal(false);
      setPostData(null);
      setAnchorEl(null);
      setPost('');
    }
    resetImageData();
  }

  function handleUpdateMutation() {
    if (editModal) {
      return updatePost({
        variables: {
          content: post,
          id: postData.id
        }
      });
    }
    return createPost({
      variables: {
        content: post,
        // TODO: Remove this dummy ID
        discussionId: '12456484',
        imageBlobIds: blobIds,
        accessibility: Object.keys(actionVisibilityOptions).find(
          key => objectAccessor(actionVisibilityOptions, key) === visibilityOption
        )
      }
    });
  }

  function handlePostCreate() {
    setPostDetails({ ...postDetails, loading: true });

    handleUpdateMutation()
      .then(() => {
        setPostDetails({
          ...postDetails,
          loading: false,
          isError: false,
          message: !editModal
            ? translate('dashboard.created_post')
            : translate('dashboard.updated_post')
        });
        setPost('');
        closeCreateModal();
        refetchNews();
      })
      .catch(err => {
        setPostDetails({
          ...postDetails,
          loading: false,
          isError: true,
          message: err.message
        });
        setPost('');
        setVisibilityOption('Everyone');
        closeCreateModal();
      });
  }

  function handleCloseAlert() {
    setPostDetails({ ...postDetails, message: '' });
  }

  return (
    <div style={{ margin: '0 5px' }}>
      <MessageAlert
        type={!postDetails.isError ? 'success' : 'error'}
        message={postDetails.message}
        open={!!postDetails.message}
        handleClose={handleCloseAlert}
      />
      <DialogWithImageUpload
        open={isCreateModalOpen || editModal}
        handleDialogStatus={closeCreateModal}
        modalDetails={modalDetails}
        observationHandler={{
          value: post,
          handleChange: val => setPost(val)
        }}
        imageOnchange={img => onChange(img)}
        imageUrls={imageUrls}
        status={status}
        closeButtonData={{
          closeButton: true,
          handleCloseButton
        }}
        editModal={editModal}
      >
        {postDetails.loading ? (
          <Spinner />
        ) : (
          <>
            <Button disableElevation onClick={closeCreateModal} data-testid="cancel-btn">
              {translate('common:form_actions.cancel')}
            </Button>
            <Button
              disabled={!post}
              disableElevation
              onClick={handlePostCreate}
              color="primary"
              variant="contained"
              data-testid="post-btn"
              style={{ color: 'white' }}
              autoFocus
            >
              {translate('common:misc.post')}
            </Button>
          </>
        )}
      </DialogWithImageUpload>
      <Button
        onClick={openCreateModal}
        variant="outlined"
        data-testid="whats-happening-btn"
        startIcon={<Avatar src={currentUserImage} />}
        style={{
          justifyContent: 'flex-start',
          textTransform: 'none',
          color: '#575757',
          borderColor: btnBorderColor,
          borderRadius: '8px',
          fontWeight: 400,
          fontSize: '16px',
          height: '56px',
          background: '#FFFFFF'
        }}
        fullWidth
      >
        {translate('dashboard.whats_happening')}
      </Button>
    </div>
  );
}

PostCreate.defaultProps = {
  postData: {},
  editModal: false,
  setPostData: () => {},
  setEditModal: () => {},
  setAnchorEl: () => {}
};

PostCreate.propTypes = {
  translate: PropTypes.func.isRequired,
  currentUserImage: PropTypes.string.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  btnBorderColor: PropTypes.string.isRequired,
  refetchNews: PropTypes.func.isRequired,
  postData: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string
  }),
  editModal: PropTypes.bool,
  setPostData: PropTypes.func,
  setEditModal: PropTypes.func,
  setAnchorEl: PropTypes.func
};
