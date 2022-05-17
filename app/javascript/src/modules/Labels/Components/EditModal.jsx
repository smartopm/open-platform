/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import { useMutation } from 'react-apollo';
import { LabelEdit, LabelCreate } from '../../../graphql/mutations';
import { colorPallete } from '../../../utils/constants';
import { formatError, ifNotTest } from '../../../utils/helpers';
import { CustomizedDialogs } from '../../../components/Dialog';
import MessageAlert from '../../../components/MessageAlert';

export default function EditModal({ open, handleClose, data, refetch, type }) {
  const [editLabel] = useMutation(LabelEdit);
  const [createLabel] = useMutation(LabelCreate);
  const [color, setColor] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [mutationLoading, setMutationLoading] = useState(false);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const { t } = useTranslation(['label', 'common']);

  function handleEdit() {
    setMutationLoading(true);
    editLabel({
      variables: { id: data.id, shortDesc, description, color }
    })
      .then(() => {
        setMutationLoading(false);
        setMessageAlert(t('label.label_edited'));
        setIsSuccessAlert(true);
        handleClose();
        refetch();
      })
      .catch(err => {
        setMutationLoading(false);
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
      });
  }

  function handleLabelCreate() {
    setMutationLoading(true);
    createLabel({
      variables: { shortDesc, description, color }
    })
      .then(() => {
        setMutationLoading(false);
        setShortDesc('');
        setDescription('');
        setColor('');
        setMessageAlert(t('label.label_created'));
        setIsSuccessAlert(true);
        handleClose();
        refetch();
      })
      .catch(err => {
        setMutationLoading(false);
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
      });
  }

  function setDefaultValues() {
    setColor(data.color);
    setShortDesc(data.shortDesc);
    setDescription(data.description);
  }

  useEffect(() => {
    setDefaultValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={() => setMessageAlert('')}
      />
      <CustomizedDialogs
        open={open}
        handleModal={handleClose}
        dialogHeader={type === 'edit' ? t('label.edit_dialog_title') : t('label.new_dialog_title')}
        handleBatchFilter={type === 'edit' ? handleEdit : handleLabelCreate}
        saveAction={
          type === 'edit' ? t('common:form_actions.save_changes') : t('common:form_actions.save')
        }
        cancelAction={t('common:form_actions.cancel')}
        disableActionBtn={mutationLoading}
      >
        <div>
          <TextField
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
          <span>{t('label.create_scoped_label_description')}</span>
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
          <div style={{ display: 'flex' }}>
            <Paper
              variant="outlined"
              style={{ height: '40px', width: '40px', margin: '5px', backgroundColor: `${color}` }}
            />
            <TextField
              autoFocus={ifNotTest()}
              variant="standard"
              margin="dense"
              id="color"
              type="text"
              fullWidth
              value={color}
              onChange={e => setColor(e.target.value)}
              inputProps={{
                'data-testid': 'color'
              }}
            />
          </div>
          <div style={{ display: 'flex' }}>
            {colorPallete.map((col, i) => (
              <Paper
                variant="outlined"
                key={i}
                style={{
                  height: '40px',
                  width: '40px',
                  margin: '5px',
                  cursor: 'pointer',
                  backgroundColor: `${col}`
                }}
                onClick={() => setColor(col)}
                data-testid="col"
              />
            ))}
          </div>
        </div>
      </CustomizedDialogs>
    </>
  );
}

EditModal.defaultProps = {
  data: {}
};

EditModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    shortDesc: PropTypes.string,
    color: PropTypes.string,
    description: PropTypes.string
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};
