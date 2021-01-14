import React from 'react'
import { IconButton, MenuItem, TextField } from '@material-ui/core'
import { DeleteOutline } from '@material-ui/icons'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { propAccessor } from '../../utils/helpers'

export default function DynamicContactFields({
  options,
  handleChange,
  handleRemoveRow,
  data
}) {
  const classes = useStyles()
  return options.map((val, i) => (
    <div
      className={classes.textField}
      // eslint-disable-next-line react/no-array-index-key
      key={i}
    >
      <TextField
        id={`${i}-${data.label}-value-input`}
        style={{ width: '300px'}}
        label={data.label}
        onChange={event => handleChange(event, i)}
        value={propAccessor(options[i], data.name)}
        name={data.name}
      />
      <TextField
        id={`${i}-select-category`}
        style={{ width: '200px', marginLeft: '40px' }}
        select
        label="Select Category"
        value={val.category}
        onChange={event => handleChange(event, i)}
        name="category"
      >
        <MenuItem value="sales">Sales</MenuItem>
        <MenuItem value="customer_care">Customer Care</MenuItem>
      </TextField>
      <IconButton
        style={{ marginTop: 13 }}
        onClick={() => handleRemoveRow(i)}
        aria-label="remove"
      >
        <DeleteOutline />
      </IconButton>
    </div>
  ))
}

DynamicContactFields.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemoveRow: PropTypes.func.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string
  })
}

const useStyles = makeStyles({
  textField: {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0'
  }
})
