import React, { useState, useEffect } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';
import { Button, Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import DialogWithImageUpload from '../../../shared/dialogs/DialogWithImageUpload';
import useFileUpload from '../../../graphql/useFileUpload';
import { PostCreateMutation } from '../../../graphql/mutations';
import MessageAlert from '../../../components/MessageAlert';
import { Spinner } from '../../../shared/Loading';

export default function PostCreate({
  translate,
  currentUserImage,
  btnBorderColor,
  refetchNews,
  isMobile
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [post, setPost] = useState('');
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
  const modalDetails = {
    title: translate('dashboard.start_post'),
    inputPlaceholder: translate('dashboard.whats_happening'),
    uploadBtnText: translate('dashboard.add_photo')
  };

  useEffect(() => {
    if (status === 'DONE') {
      setImageUrls([...imageUrls, url]);
      setBlobIds([...blobIds, signedBlobId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
    resetImageData();
  }

  function handlePostCreate() {
    setPostDetails({ ...postDetails, loading: true });

    createPost({
      variables: {
        content: post,
        // TODO: Remove this dummy ID
        discussionId: '12456484',
        imageBlobIds: blobIds
      }
    })
      .then(() => {
        setPostDetails({
          ...postDetails,
          loading: false,
          isError: false,
          message: translate('dashboard.created_post')
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
        closeCreateModal();
      });
  }

  function handleCloseAlert() {
    setPostDetails({ ...postDetails, message: '' });
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
        open={isCreateModalOpen}
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
      >
        {postDetails.loading ? (
          <Spinner />
        ) : (
          <>
            <Button
              onClick={closeCreateModal}
              color="secondary"
              variant="outlined"
              data-testid="cancel-btn"
            >
              {translate('common:form_actions.cancel')}
            </Button>
            <Button
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
          width: isMobile ? '98%' : '99%'
        }}
        fullWidth
      >
        {translate('dashboard.whats_happening')}
      </Button>
    </>
  );
}

PostCreate.propTypes = {
  translate: PropTypes.func.isRequired,
  currentUserImage: PropTypes.string.isRequired,
  btnBorderColor: PropTypes.string.isRequired,
  refetchNews: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
};
