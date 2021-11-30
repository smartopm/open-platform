/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { useMutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import CommentCard from './CommentCard';
import { TaskComment } from '../../../graphql/mutations';

export default function CommentTextField({ data, refetch, taskId }) {
  const [commentCreate] = useMutation(TaskComment);
  const [body, setBody] = useState('');
  const [error, setErrorMessage] = useState('');
  const { t } = useTranslation('common');

  function handleSubmit(event) {
    event.preventDefault();
    commentCreate({
      variables: {
        noteId: taskId,
        body
      }
    })
      .then(() => {
        setBody('');
        refetch();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }
  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginBottom: 0}}>
        <Grid container>
          <Grid item md={10} xs={8} style={{ paddingRight: '10px'}}>
            <TextField
              fullWidth
              id="standard-full-width"
              style={{ margin: 0 }}
              placeholder={t('common:misc.type_comment')}
              value={body}
              onChange={e => setBody(e.target.value)}
              multiline
              rows={1}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                  shrink: true
                }}
              inputProps={{ 'data-testid': 'body_input' }}
            />
          </Grid>
          <Grid item md={2} xs={4}>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              disabled={!body.length}
              data-testid="share"
              style={{ height: '56px' }}
            >
              {t('misc.comment')}
            </Button>
          </Grid>
        </Grid>
      </form>
      <CommentCard data={data} refetch={refetch} />
      { Boolean(error.length) && (<p className="text-center">{error}</p>)}
    </>
  );
}

CommentTextField.defaultProps = {
  data: {},
  taskId: ''
};
CommentTextField.propTypes = {
  data: PropTypes.object,
  refetch: PropTypes.func.isRequired,
  taskId: PropTypes.string
};
