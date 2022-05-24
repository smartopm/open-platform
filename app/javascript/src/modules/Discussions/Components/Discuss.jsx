/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Button, TextField, Snackbar } from '@mui/material';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DiscussionMutation } from '../../../graphql/mutations';

export default function Discuss({ update }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createDiscuss] = useMutation(DiscussionMutation);
  const { t } = useTranslation(['common', 'discussion']);
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    createDiscuss({ variables: { title, description } })
      .then(() => {
        setMessage(t('errors.empty_text'));
        setLoading(false);
        setTimeout(() => {
          update();
        }, 1000);
        setOpen(!open);
      })
      .catch(err => {
        setLoading(false);
        setMessage(err.message);
      });
  }

  return (
    <div className="container">
      <Snackbar
        color="success"
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(!open)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={t('discussion:messages.discussion_topic_created')}
      />
      <form onSubmit={handleSubmit} aria-label="discuss-form">
        <TextField
          name="title"
          label={t('label.discussion_title')}
          style={{ width: '63vw' }}
          placeholder={t('placeholder.type_comment')}
          onChange={e => setTitle(e.target.value)}
          value={title}
          margin="normal"
          inputProps={{
            'aria-label': 'discuss_title',
            'data-testid': 'title'
          }}
          InputLabelProps={{
            shrink: true
          }}
          required
        />
        <TextField
          name="description"
          label={t('discussion:label.discussion_description')}
          style={{ width: '63vw' }}
          placeholder={t('discussion:placeholder.type_comment')}
          onChange={e => setDescription(e.target.value)}
          value={description}
          multiline
          rows={3}
          margin="normal"
          inputProps={{
            'aria-label': 'discuss_description',
            'data-testid': 'description'
          }}
          InputLabelProps={{
            shrink: true
          }}
          required
        />
        <br />
        <div className="d-flex row justify-content-center">
          <Button
            variant="contained"
            aria-label="discussion_cancel"
            color="secondary"
            onClick={update}
            className={`${css(discussStyles.cancelBtn)}`}
          >
            {t('form_actions.cancel')}
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={loading}
            aria-label="discussion_submit"
            className={`${css(discussStyles.submitBtn)}`}
            data-testid="button"
          >
            {loading ? t('form_actions.submitting') : t('form_actions.submit')}
          </Button>
        </div>
        <br />
        <p className="text-center">{Boolean(msg.length) && msg}</p>
      </form>
    </div>
  );
}

Discuss.propTypes = {
  update: PropTypes.func.isRequired
};

export const discussStyles = StyleSheet.create({
  submitBtn: {
    width: '30%',
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF'
    }
  },
  cancelBtn: {
    width: '30%',
    marginRight: '20vw',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF'
    }
  }
});
