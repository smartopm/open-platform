/* eslint-disable no-use-before-define */
import React, { useContext, useState } from 'react';
import List from '@mui/material/List';
import { useMutation, useApolloClient } from 'react-apollo';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { PostCreateMutation, PostDeleteMutation } from '../../../graphql/mutations';
import useFileUpload from '../../../graphql/useFileUpload';
import DeleteDialogueBox from '../../../shared/dialogs/DeleteDialogue';
import CommentBox from './CommentBox'
import CommentSection from './CommentSection'

export default function Comments({ comments, refetch, discussionId }) {
  const init = {
    message: '',
    error: '',
    isLoading: false
  };
  const authState = useContext(Context);
  const { id } = useParams();
  const [_data, setData] = useState(init);
  const [openModal, setOpenModal] = useState(false);
  const [commentId, setCommentId] = useState('');
  const [error, setError] = useState(null);
  const [createPost] = useMutation(PostCreateMutation);
  const [deletePost] = useMutation(PostDeleteMutation);
  const { t } = useTranslation('common');

  function handleDeleteClick(cid = commentId) {
    setOpenModal(!openModal);
    setCommentId(cid);
  }

  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });

  function handleDeleteComment() {
    deletePost({
      variables: { id: commentId }
    })
      .then(() => {
        refetch();
        setOpenModal(!openModal);
      })
      .catch(err => setError(err.message));
  }

  function handleCommentChange(event) {
    setData({ ..._data, message: event.target.value });
  }

  function sendComment() {
    setData({ ..._data, isLoading: true });
    if (!_data.message.length) {
      setData({ ..._data, error: t('common:errors.empty_text') });
      return;
    }
    createPost({
      variables: {
        content: _data.message,
        discussionId,
        imageBlobIds: [signedBlobId]
      }
    })
      .then(() => {
        setData({ ..._data, isLoading: false, message: '' });
        refetch();
      })
      .catch(err => setData({ ..._data, error: err.message }));
  }
  if (!id) return <span />;
  // don't show comments on pages that dont have known posts like /news
  const uploadData = {
    handleFileUpload: onChange,
    status,
    url
  };
  return (
    <List>
      <CommentBox
        authState={authState}
        data={_data}
        handleCommentChange={handleCommentChange}
        upload={uploadData}
        sendComment={sendComment}
      />
      {error && <p>{error}</p>}
      {comments.length >= 1 ? (
        comments.map(comment => (
          <CommentSection
            key={comment.id}
            data={{
              isAdmin: authState.user.userType === 'admin',
              createdAt: comment.createdAt,
              comment: comment.content,
              imageUrls: comment.imageUrls,
              user: comment.user,
              id: comment.id
            }}
            handleDeleteComment={() => handleDeleteClick(comment.id)}
            refetch={refetch}
          />
        ))
      ) : (
        <p className="text-center">{t('common:misc.first_to_post')}</p>
      )}
      <DeleteDialogueBox
        open={openModal}
        handleClose={handleDeleteClick}
        handleAction={handleDeleteComment}
        title={t('common:misc.post', { count: 1 })}
      />
    </List>
  );
}

Comments.propTypes = {
  // eslint-disable-next-line
  comments: PropTypes.array,
  discussionId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired
};
