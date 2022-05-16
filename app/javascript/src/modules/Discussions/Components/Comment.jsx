/* eslint-disable no-use-before-define */
import React, { useContext, useState } from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  TextField,
  List,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import { useMutation, useApolloClient } from 'react-apollo';
import { useParams, useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { PostCreateMutation, PostDeleteMutation } from '../../../graphql/mutations';
import useFileUpload from '../../../graphql/useFileUpload';
import { findLinkAndReplace, sanitizeText } from '../../../utils/helpers';
import Avatar from '../../../components/Avatar';
import DateContainer from '../../../components/DateContainer';
import DeleteDialogueBox from '../../../shared/dialogs/DeleteDialogue';
// import { commentStatusAction } from '../../utils/constants';
import ImageAuth from '../../../shared/ImageAuth';

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
              user: comment.user
            }}
            handleDeleteComment={() => handleDeleteClick(comment.id)}
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

export function CommentSection({ data, handleDeleteComment }) {
  return (
    <ListItem alignItems="flex-start">
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
                <IconButton
                  onClick={handleDeleteComment}
                  edge="end"
                  aria-label="delete"
                  className={css(styles.deleteBtn)}
                  color="primary"
                  size="large"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </span>
          </>
        )}
      />
    </ListItem>
  );
}

export function CommentBox({ authState, sendComment, data, handleCommentChange, upload }) {
  // in the future instead of using location,
  // pass a prop called isUpload and show upload icon or don't
  const location = useLocation();
  const { t } = useTranslation(['common', 'discussion']);
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar user={authState.user} />
        </ListItemAvatar>
        <TextField
          id="standard-full-width"
          style={{ width: '95vw', margin: 15, marginTop: 7 }}
          placeholder={t('common:misc.type_post')}
          label={t('common:misc.type_post')}
          value={data.message}
          onChange={handleCommentChange}
          multiline
          rows={3}
          margin="normal"
          variant="outlined"
          inputProps={{ 'data-testid': 'post_content' }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </ListItem>
      <br />
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-start"
        className={css(styles.actionBtns)}
      >
        {upload.status === 'DONE' && (
          <Grid item>
            <p style={{ marginTop: 5, marginRight: 35 }}>{t('common:misc.image_uploaded')}</p>
          </Grid>
        )}
        <Grid item>
          {location.pathname.includes('discussion') && (
            <label style={{ marginTop: 5 }} htmlFor="image">
              <input
                type="file"
                name="image"
                id="image"
                capture
                onChange={event => upload.handleFileUpload(event.target.files[0])}
                style={{ display: 'none' }}
              />
              <AddPhotoAlternateIcon color="primary" className={css(styles.uploadIcon)} />
            </label>
          )}
        </Grid>
        <Grid item>
          <Button
            color="primary"
            onClick={sendComment}
            data-testid="comment_button"
            disabled={data.isLoading}
          >
            {location.pathname.includes('message')
              ? t('common:misc.send')
              : t('common:misc.post', { count: 1 })}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

Comments.propTypes = {
  // eslint-disable-next-line
  comments: PropTypes.array,
  discussionId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired
};

CommentBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object.isRequired,
  sendComment: PropTypes.func.isRequired,
  handleCommentChange: PropTypes.func.isRequired,
  // eslint-disable-next-line
  upload: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired
};

CommentSection.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool,
    imageUrls: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  handleDeleteComment: PropTypes.func.isRequired
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
