import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, TextField, Typography } from '@material-ui/core'
import { AddCircleOutline, DeleteOutline } from '@material-ui/icons'
import PhoneInput from 'react-phone-input-2'
import { useTranslation } from 'react-i18next';
import { propAccessor } from '../../../utils/helpers'

/**
 *
 * @param {@description} this is for form fields that require separate inputs of same type
 * eg:
 * @example Phone Number => Phone Number 1, Phone Number 2
 */
export default function FormOptionInput({ options, setOptions, label }) {
  const { t } = useTranslation('common');
  function handleOptionChange(event, index){
    const values = options
    values[parseInt(index, 10)] = event.target.value
    setOptions([...values])
  }

  function handleAddOption(){
    setOptions([...options, ""])
  }

  function handleRemoveOption(index){
    const values = options
    values.splice(index, 1)
    setOptions([...values])
  }
  return (
    <div>
      {
        options.map((value, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            <label
              htmlFor='phoneNumber'
              className="MuiFormLabel-root MuiInputLabel-shrink
              MuiInputLabel-root"
            >
              Secondary Phone Number&nbsp;
              {i}
              <span aria-hidden="true" className="MuiFormLabel-asterisk MuiInputLabel-asterisk">
              &nbsp;*
              </span>
            </label>
            {(label === t('common:form_fields.secondary_number'))
              ? (
                <PhoneInput
                  value={propAccessor(options, i)?.info}
                  enableSearch
                  inputProps={{
                   name: 'phoneNumber',
                   required: true
                 }}
                  placeholder={t('common:form_placeholders.phone_number')}
                  onChange={val => {
                  const values = options
                  values[parseInt(i, 10)] = val
                  setOptions([...options])
                 }}
                  preferredCountries={['hn', 'zm', 'ng', 'in', 'us']}
                  containerStyle={{
                   width: '30%',
                   display: 'inline-block',
                   marginRight: '5px'
                }}
                />
)
              : (
                <TextField
                  label={`${label} ${i}`}
                  variant="outlined"
                  size="small"
                  style={{ width: 300 }}
                  value={propAccessor(options, i)?.info}
                  onChange={event => handleOptionChange(event, i)}
                  margin="normal"
                  autoFocus
                  required
                />
)}

            <IconButton
              style={{ marginTop: 13 }}
              onClick={handleRemoveOption}
              aria-label="remove"
            >
              <DeleteOutline />
            </IconButton>
          </div>
        ))
      }
      <IconButton onClick={handleAddOption} aria-label="add" style={{ marginLeft: -15 }}>
        <AddCircleOutline />
        <Typography color="primary" style={{ marginLeft: 10 }}>
          { `  Add ${label}` }
        </Typography>
      </IconButton>
    </div>
  )
}

export function FormOptionWithOwnActions({ actions, value, id }) {
  return (
    <div>
      <TextField
        label={`option ${id}`}
        variant="outlined"
        size="small"
        defaultValue={value}
        onChange={actions.handleOptionChange}
        margin="normal"
        autoFocus
        required
        style={{ width: 300 }}
      />
      <IconButton
        style={{ marginTop: 13 }}
        onClick={actions.handleRemoveOption}
        aria-label="remove"
      >
        <DeleteOutline />
      </IconButton>
    </div>

  )
}

FormOptionInput.propTypes = {
  /**
   * an array of string, that show different option fields
   */
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * a function that updates the options, it gets the given value and updates the array
   * at a correct index
   */
  setOptions: PropTypes.func.isRequired,
  /**
   * Description of a field being updated
   */
  label: PropTypes.string.isRequired
}

FormOptionWithOwnActions.propTypes = {
  actions: PropTypes.shape({
    handleRemoveOption: PropTypes.func,
    handleOptionChange: PropTypes.func
  }).isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired
}
