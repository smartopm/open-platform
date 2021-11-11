/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useMutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
import CommentCard from './CommentCard';
import { TaskComment } from '../../../graphql/mutations';

export default function CommentTextField({ data, refetch, taskId }) {
  const classes = useStyles();
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
      <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
        <div className={classes.root} style={{ display: 'flex' }}>
          <TextField
            fullWidth
            id="standard-full-width"
            style={{ width: '46vw' }}
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
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            disabled={!body.length}
            data-testid="share"
            style={{ width: '110px', height: '56px', marginTop: '8px' }}
          >
            {t('misc.comment')}
          </Button>
        </div>
      </form>
      <CommentCard data={data} refetch={refetch} />
      <p className="text-center">{Boolean(error.length) && error}</p>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px'
    },
    '& .MuiButton-contained': {
      width: 100,
      marginLeft: '8px',
      color: 'white'
    },
    '& .Mui-disabled': {
      color: 'white',
      border: '2px white solid'
    }
  }
}));

CommentTextField.defaultProps = {
  data: {},
  taskId: ''
};
CommentTextField.propTypes = {
  data: PropTypes.object,
  refetch: PropTypes.func.isRequired,
  taskId: PropTypes.string
};
