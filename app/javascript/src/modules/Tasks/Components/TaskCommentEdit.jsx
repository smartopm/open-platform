/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { TaskCommentUpdate } from '../../../graphql/mutations';

export default function EditField({ handleClose, data, refetch }) {
  const classes = useStyles();
  const [body, setBody] = useState('');
  const [commentUpdate] = useMutation(TaskCommentUpdate);
  const [error, setErrorMessage] = useState('');
  const { t } = useTranslation('common');

  function handleSubmit(event) {
    event.preventDefault();
    commentUpdate({
      variables: {
        id: data.id,
        body
      }
    })
      .then(() => {
        handleClose();
        refetch();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }

  useEffect(() => {
    setBody(data.body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div style={{ display: 'flex', margin: '10px 0 0 13px' }}>
        <Avatar style={{ margin: '-7px 10px 0 0' }} src={data.user.imageUrl} alt="avatar-image" />
        <form className={classes.root} onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              multiline
              value={body}
              id="outlined-size-small"
              variant="outlined"
              size="small"
              onChange={e => setBody(e.target.value)}
              inputProps={{ 'data-testid': 'body_input' }}
            />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
              <Button
                autoFocus
                variant="contained"
                data-testid="button"
                type="submit"
                color="primary"
                style={{ marginRight: '5px' }}
              >
                {t('form_actions.save_changes')}
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
                data-testid="cancel"
              >
                {t('form_actions.cancel')}
              </Button>
            </div>
          </div>
        </form>
      </div>
      <p className="text-center">{Boolean(error.length) && error}</p>
    </>
  );
}

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    marginTop: '-5px',
    borderRadius: '0 10px 10px 50px',
    backgroundColor: '#fafafa'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

EditField.defaultProps = {
  data: {}
};

EditField.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  refetch: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};
