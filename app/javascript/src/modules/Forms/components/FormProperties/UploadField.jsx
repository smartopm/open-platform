import React from 'react'
import { AddCircleOutline } from '@material-ui/icons'
import DoneIcon from '@material-ui/icons/Done'
import { Button, FormHelperText } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export default function UploadField({ detail, upload, editable, uploaded, inputValidation, btnColor }) {
  const { t } = useTranslation(['common', 'form'])
  return (
    <>
      <label htmlFor={`button-${detail.label}`}>
        <FormHelperText
          style={{
            margin: '4px 4px -12px 0',
          }}
        >
          {`${detail.label || ''} ${detail.required ? '*' : ''}`}
        </FormHelperText>
        <input
          type="file"
          name={`image-${detail.label}`}
          id={`button-${detail.label}`}
          aria-label={`upload_field_${detail.label}`}
          capture
          onChange={upload}
          readOnly={editable}
          hidden
        />
        <Button
          variant="text"
          component="span"
          aria-label={`upload_button_${detail.label}`}
          disabled={editable}
          startIcon={detail.type === 'file' && uploaded ? <DoneIcon /> : <AddCircleOutline />}
          color={btnColor}
        >
          {uploaded ? t('form:misc.file_uploaded') : t('form:misc.upload_file')}
        </Button>
        {inputValidation.error && <FormHelperText error data-testid="error-msg">{t('form:errors.required_field', { fieldName: inputValidation.fieldName })}</FormHelperText>}
      </label>
    </>
  )
}

UploadField.defaultProps = {
  uploaded: false,
  inputValidation: {
    error: false,
    fieldName: ""
  },
  btnColor: "default"
}

UploadField.propTypes = {
  detail: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
  }).isRequired,
  upload: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  uploaded: PropTypes.bool,
  btnColor: PropTypes.string,
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  })
}
