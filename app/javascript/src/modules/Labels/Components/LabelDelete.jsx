/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { useMutation } from 'react-apollo';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import { DeleteLabel } from '../../../graphql/mutations';

export default function TaskDelete({ open, handleClose, refetch, data }) {
  const classes = useStyles();
  const [labelDelete] = useMutation(DeleteLabel);
  const [error, setErrorMessage] = useState('');
  const { t } = useTranslation(['label', 'common']);

  function handleDelete(comId) {
    labelDelete({
      variables: {
        id: comId
      }
    })
      .then(() => {
        handleClose();
        refetch();
      })
      .catch(err => {
        handleClose();
        setErrorMessage(err);
      });
  }

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} className={classes.title}>
          {t('label.delete_dialog_title')}
        </DialogTitle>
        <DialogContent style={{ margin: '15px', textAlign: 'center' }}>
          {t('label.delete_warning_text', { shortDesc: data.shortDesc })}
        </DialogContent>
        <Divider />
        <DialogActions style={{ margin: '10px' }}>
          <Button onClick={handleClose} variant="outlined" color="secondary" data-testid="cancel">
            {t('common:form_actions.cancel')}
          </Button>
          <Button
            autoFocus
            onClick={() => handleDelete(data.id)}
            variant="contained"
            style={{ backgroundColor: '#dc402b', color: 'white' }}
            data-testid="button"
          >
            {t('common:form_actions.save_changes')}
          </Button>
        </DialogActions>
      </Dialog>
      <p className="text-center">{Boolean(error.length) && error}</p>
    </>
  );
}

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: '10px'
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  title: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  },
  deleteCard: {
    fontSize: '14px',
    fontWeight: 'bold'
  }
});

TaskDelete.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    shortDesc: PropTypes.string
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
