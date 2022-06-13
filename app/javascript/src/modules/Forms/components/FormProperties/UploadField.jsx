import React from 'react';
import { Button, FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function UploadField({
  detail,
  upload,
  editable,
  uploaded,
  inputValidation,
  btnColor,
  showDetails
}) {
  const { t } = useTranslation(['common', 'form']);
  const matches = useMediaQuery('(max-width:428px)');
  const classes = useStyles();
  return (
    <>
      <label htmlFor={`button-${detail.id}`} style={{ width: '100%', borderRadius: '5px' }}>
        <FormHelperText
          style={{
            margin: '5px 0 5px 0'
          }}
        >
          {`${detail.label || ''} ${detail.required ? '*' : ''}`}
        </FormHelperText>
        {showDetails && (
          <FormHelperText style={{ padding: '5px 0 15px 0', fontSize: '14px' }} data-testid='upload_details'>
            {t('form:misc.upload_details')}
          </FormHelperText>
        )}
        <input
          type="file"
          accept="image/*, .pdf"
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
          startIcon={<FileUploadIcon data-testid="upload_icon" />}
          color={btnColor}
          style={{ background: '#FFFFFF' }}
        >
          {t('form:misc.select_file')}
        </Button>
        {showDetails && uploaded && (
          <Button
            variant="contained"
            data-testid="details_button"
            component="span"
            disabled={editable}
            aria-label={`upload_button_${detail.label}`}
            className={classes.button}
            startIcon={detail.type === 'file' && <CheckCircleIcon data-testid="done_icon" className={classes.iconColor} />}
            style={matches ? {marginTop: '10px'} : { marginLeft: '10px' }}
            disableElevation
          >
            {`${detail.fileCount} ${t('form:misc.file_uploaded', { count: detail.fileCount })}`}
          </Button>
        )}
        {inputValidation.error && (
          <FormHelperText error data-testid="error-msg">
            {t('form:errors.required_field', { fieldName: inputValidation.fieldName })}
          </FormHelperText>
        )}
      </label>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  button: {
    background: theme.palette.success.main,
    color: '#FFFFFF'
  },
  iconColor: {
    color: '#FFFFFF'
  }
}));

UploadField.defaultProps = {
  uploaded: false,
  inputValidation: {
    error: false,
    fieldName: ''
  },
  btnColor: 'default',
  showDetails: false
};

UploadField.propTypes = {
  detail: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
    id: PropTypes.string,
    required: PropTypes.bool,
    fileCount: PropTypes.number,
    currentPropId: PropTypes.string
  }).isRequired,
  upload: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  uploaded: PropTypes.bool,
  btnColor: PropTypes.string,
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  }),
  showDetails: PropTypes.bool
};
