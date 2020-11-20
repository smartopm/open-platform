import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, TextField } from '@material-ui/core'
import { DeleteOutline } from '@material-ui/icons'

export default function FormOptionInput({ actions, value, id }) {
  return (
    <div>
      <TextField
        label={`option ${id}`}
        variant="outlined"
        size="small"
        value={value}
        onChange={actions.handleOptionChange}
        margin="normal"
        autoFocus
        required
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
  actions: PropTypes.shape({
    handleRemoveOption: PropTypes.func,
    handleOptionChange: PropTypes.func
  }).isRequired,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.string,
  id: PropTypes.number.isRequired
}
