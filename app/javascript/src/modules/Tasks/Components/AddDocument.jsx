import React, { useContext, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { UpdateNote } from '../../../graphql/mutations';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function AddDocument({ onChange, status, signedBlobId, taskId, refetch}) {
  const { t } = useTranslation('task');
  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const [taskUpdate] = useMutation(UpdateNote);

  function handleUploadDocument(event) {
    onChange(event.target.files[0]);
  }
  

  useEffect(() => {
    if (status === 'ERROR') {
      showSnackbar({ type: messageType.error, message: t('document.upload_error') });
      return;
    }

    if (status === 'DONE') {
      taskUpdate({ variables: { id: taskId, documentBlobId: signedBlobId } })
        .then(() => {
          refetch();
        })
        .catch(err => {
          showSnackbar({ type: messageType.error, message: err.message});
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, taskId, signedBlobId, taskUpdate, refetch]);
  return (
    <>
      <IconButton
        edge="end"
        aria-label="add_document"
        data-testid="add_document"
        component="label"
        color="primary"
        style={{backgroundColor: 'transparent'}}
      >
        <input
          hidden
          type="file"
          onChange={event => handleUploadDocument(event)}
          id="task-attach-file"
          data-testid="add_document_input"
        />
        <div style={{display: 'flex'}}>
          <AddCircleIcon />
          <Typography style={{padding: '2px 0 0 5px'}} variant="caption">Add Document</Typography>
        </div>
      </IconButton>
    </>
  )
}

AddDocument.defaultProps = {
  onChange: () => {},
  signedBlobId: null,
  refetch: () => {},
  status: null
}

AddDocument.propTypes = {
  onChange: PropTypes.func,
  signedBlobId: PropTypes.string,
  taskId: PropTypes.string.isRequired,
  refetch: PropTypes.func,
  status: PropTypes.string
};