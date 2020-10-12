/* eslint-disable react/prop-types */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { useMutation } from 'react-apollo';
import { LabelEdit } from '../../graphql/mutations';

export default function EditModal({ open, handleClose, data, refetch }) {
  const [editLabel] = useMutation(LabelEdit);
  function handleEdit() {
    editLabel({
      variables: { id: data.id, shortDesc: data.shortDesc }
    }).then(() => {
      handleClose();
      refetch();
    });
  }
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Label</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={data.shortDesc}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            value={data.description}
          />
          <Paper variant="outlined" style={{ height: '40px', width: '40px'}} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            CANCEL
          </Button>
          <Button onClick={handleEdit} color="primary" variant="contained">
            SAVE CHANGES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}