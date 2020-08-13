import React from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Button,
  Chip
} from '@material-ui/core'
import PropTypes from 'prop-types'

/**
 *
 * @description this component will not work with single array type of dropdown, e.g: userType, userState
 * @returns ReactNode
 */
export default function FilterComponent({
  handleInputChange,
  list,
  stateList,
  classes,
  resetFilter,
  type
}) {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-mutiple-chip-label">Filter by {type}</InputLabel>
      <Select
        labelId={`select-by-${type}`}
        id={`${type}-chip`}
        multiple
        value={stateList}
        onChange={handleInputChange}
        input={<Input id={`select-by-${type}`} />}
        renderValue={selected => (
          <div>
            {selected.map((value, i) => (
              <Chip key={i} label={value} />
            ))}
          </div>
        )}
      >
        {list.map(item => (
          // change the below line depending on the usage
          <MenuItem key={item.id} value={item.name || item.shortDesc}>
            {item.name || item.shortDesc}
          </MenuItem>
        ))}
      </Select>
      {Boolean(stateList.length) && (
        <Button onClick={resetFilter}>Clear Filter</Button>
      )}
    </FormControl>
  )
}

FilterComponent.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  stateList: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  resetFilter: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}