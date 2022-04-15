import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { Button, FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslation } from 'react-i18next';

export default function UploadField({
  detail,
  upload,
  editable,
  uploaded,
  inputValidation,
  btnColor
}) {
  const { t } = useTranslation(['common', 'form']);
  return (
    <>
      <label
        htmlFor={`button-${detail.id}`}
        style={{ width: '100%', borderRadius: '5px',}}
      >
        <FormHelperText
          style={{
            margin: '5px 0 5px 0'
          }}
        >
          {`${detail.label || ''} ${detail.required ? '*' : ''}`}
        </FormHelperText>
        <input
          type="file"
          accept="image/*, .pdf, .zip"
          name={`image-${detail.label}`}
          id={`button-${detail.id}`}
          data-testid="form-file-input"
          aria-label={`upload_field_${detail.label}`}
          capture
          onChange={upload}
          readOnly={editable}
          multiple
          hidden
        />
        <Button
          variant="outlined"
          data-testid="form-file-upload-btn"
          component="span"
          aria-label={`upload_button_${detail.label}`}
          disabled={editable}
          startIcon={detail.type === 'file' && uploaded ? <DoneIcon /> : <FileUploadIcon />}
          color={btnColor}
          style={{background: '#FFFFFF'}}
        >
          {uploaded ? t('form:misc.file_uploaded') : t('form:misc.upload_file')}
        </Button>
        {inputValidation.error && (
          <FormHelperText error data-testid="error-msg">
            {t('form:errors.required_field', { fieldName: inputValidation.fieldName })}
          </FormHelperText>
        )}
      </label>
    </>
  );
}

UploadField.defaultProps = {
  uploaded: false,
  inputValidation: {
    error: false,
    fieldName: ''
  },
  btnColor: 'default'
};

UploadField.propTypes = {
  detail: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    required: PropTypes.bool
  }).isRequired,
  upload: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  uploaded: PropTypes.bool,
  btnColor: PropTypes.string,
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  })
};
