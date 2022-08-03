import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Avatar from '../../../components/Avatar';

export default function CommentBox({ authState, sendComment, data, handleCommentChange, upload }) {
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
                data-testid="discussion_upload"
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
