import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, TextField, Typography } from '@material-ui/core'
import { AddCircleOutline, DeleteOutline } from '@material-ui/icons'

/**
 * 
 * @param {@description} this is for form fields that require separate inputs of same type
 * eg:  
 * @example Phone Number => Phone Number 1, Phone Number 2
 */ 
export default function FormOptionInput({ options, setOptions, label }) {
  function handleOptionChange(event, index){
    const values = options
    values[index] = event.target.value
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
            <TextField
              label={`${label} ${i}`}
              variant="outlined"
              size="small"
              style={{ width: 300 }}
              value={options[i]}
              onChange={event => handleOptionChange(event, i)}
              margin="normal"
              autoFocus
              required
            />
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
      <IconButton onClick={handleAddOption} aria-label="add">
        <AddCircleOutline /> 
        <Typography color="primary" style={{ marginLeft: 10 }}>
          { `  Add ${label}` }
        </Typography>
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
