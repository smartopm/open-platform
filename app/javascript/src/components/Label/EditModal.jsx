/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { useMutation } from 'react-apollo';
import { LabelEdit } from '../../graphql/mutations';
import { colorPallete } from '../../utils/constants'

export default function EditModal({ open, handleClose, data, refetch }) {
  const [editLabel] = useMutation(LabelEdit);
  const [color, setColor] = useState(null)
  const [error, setErrorMessage] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [description, setDescription] = useState('')
  const { t } = useTranslation(['label', 'common'])

  function handleEdit() {
    editLabel({
      variables: { id: data.id, shortDesc, description, color }
    }).then(() => {
      handleClose();
      refetch();
    }).catch((err) => {
      handleClose()
      setErrorMessage(err)
    })
  }
  function setDefaultValues() {
    setColor(data.color)
    setShortDesc(data.shortDesc)
    setDescription(data.description)
  }
  useEffect(() => {
    setDefaultValues()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('label.edit_dialog_title')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label={t('label.title_field_label')}
            type="text"
            fullWidth
            value={shortDesc}
            onChange={e => setShortDesc(e.target.value)}
            inputProps={{
              'data-testid': 'title'
            }}
          />
          <TextField
            margin="dense"
            id="description"
            label={t('label.description_field_label')}
            type="text"
            fullWidth
            multiline
            value={description}
            onChange={e => setDescription(e.target.value)}
            inputProps={{
              'data-testid': 'description'
            }}
          />
          <div style={{display: 'flex'}}>
            <Paper 
              variant="outlined"  
              style={{ height: '40px', width: '40px', margin: '5px', backgroundColor: `${color}`}}
            />
            <TextField
              margin="dense"
              id="color"
              label={t('label.background_color_field_label')}
              type="text"
              fullWidth
              value={color}
              onChange={e => setColor(e.target.value)}
              inputProps={{
                'data-testid': 'color'
              }}
            />
          </div>
          <div style={{display: 'flex'}}>
            {colorPallete.map((col,i) => (
              <Paper 
                variant="outlined" 
                key={i} 
                style={{ height: '40px', width: '40px', margin: '5px', cursor: 'pointer', backgroundColor: `${col}`}}
                onClick={() => setColor(col)}
                data-testid='col'
              />
            )
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined" data-testid='cancel_button'>
            {t('common:form_actions.cancel')}
          </Button>
          <Button onClick={handleEdit} color="primary" variant="contained" data-testid='button'>
            {t('common:form_actions.save_changes')}
          </Button>
        </DialogActions>
      </Dialog>
      <p className="text-center">
        {Boolean(error.length) && error}
      </p>
    </div>
  );
}

EditModal.propTypes = {
  data: PropTypes.shape({
      id: PropTypes.string,
      shortDesc: PropTypes.string,
      color: PropTypes.string,
      description: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired
}