import React from 'react'
import { TextField, MenuItem } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';

export default function TextInput({id, handleValue, properties, value, editable, inputValidation }) {
    const { t } = useTranslation('form');
    return (
      <TextField
        id={id}
        label={properties.fieldName}
        fullWidth
        className={`form-txt-input-property-${properties.fieldName}`}
        style={{background: '#FFFFFF'}}
        defaultValue={value}
        onChange={handleValue}
        margin="dense"
        variant="outlined"
        aria-label="text-input"
        name={properties.fieldName}
        inputProps={{ 'data-testid': `${properties.fieldName}-id`, readOnly: editable }}
        required={properties.required}
         /* eslint-disable no-nested-ternary */
        select={properties.fieldType === 'dropdown'}
        {...inputValidation} 
        helperText={(editable && inputValidation.error)
           ? t('errors.required_field_for_admins_only', { fieldName: properties.fieldName })
           : editable
             ? t('errors.admins_only')
             : inputValidation.error
               ? t('errors.required_field', { fieldName: properties.fieldName })
               : ''}
      >
        { properties.fieldType === 'dropdown' &&
         (
           properties.fieldValue?.map(obj => (
             <MenuItem key={obj.label} value={obj.value}>
               {obj.value}
             </MenuItem>
           ))
         )
        }
      </TextField>
    )
  }

TextInput.defaultProps = {
  inputValidation: {
    error: false,
  }
}

TextInput.propTypes = {
      handleValue: PropTypes.func.isRequired,
      properties: PropTypes.shape({
          fieldName: PropTypes.string,
          required: PropTypes.bool,
          fieldType: PropTypes.string,
          fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      }).isRequired,
      // eslint-disable-next-line react/require-default-props
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
      editable: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      inputValidation: PropTypes.shape({
        error: PropTypes.bool,
    }),
  }