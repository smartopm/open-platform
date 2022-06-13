/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import { TaskCommentUpdate } from '../../../graphql/mutations';
import ReusableMentionsInput from '../../../shared/ReusableMentionsInput';

export default function EditField({ handleClose, data, refetch, commentsRefetch, mentionsData }) {
  const classes = useStyles();
  const [body, setBody] = useState('');
  const [mentionedDocuments, setMentionedDocuments] = useState([]);
  const [commentUpdate] = useMutation(TaskCommentUpdate);
  const [error, setErrorMessage] = useState('');
  const { t } = useTranslation('common');

  function handleSubmit(event) {
    event.preventDefault();
    commentUpdate({
      variables: {
        id: data.id,
        taggedDocuments: mentionedDocuments,
        body
      }
    })
      .then(() => {
        handleClose();
        refetch();
        commentsRefetch();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }

  useEffect(() => {
    setBody(data.body);
    setMentionedDocuments(data.taggedDocuments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div style={{ display: 'flex', margin: '10px 0 0 13px' }}>
        <Avatar style={{ margin: '-7px 10px 0 0' }} src={data.user.imageUrl} alt="avatar-image" />
        <form className={classes.root}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ReusableMentionsInput
              commentValue={body}
              setCommentValue={setBody}
              data={mentionsData}
              setMentions={setMentionedDocuments}
            />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
              <Button
                autoFocus
                variant="contained"
                data-testid="button"
                type="submit"
                color="primary"
                style={{ marginRight: '5px', color: '#FFFFFF' }}
                onClick={handleSubmit}
                disableElevation
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
  data: {},
  commentsRefetch: () => {},
  mentionsData: []
};

EditField.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  refetch: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  commentsRefetch: PropTypes.func,
  mentionsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display: PropTypes.string
    })
  )
};
