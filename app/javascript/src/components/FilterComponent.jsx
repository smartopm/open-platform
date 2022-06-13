/* eslint-disable */
import React from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  Button,
  Chip
} from '@mui/material'
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
  type,
  filterOpen,
  handleOpenSelect
}) {
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-mutiple-chip-label">Filter by {type}</InputLabel>
      <Select
        labelId={`select-by-${type}`}
        id={`${type}-chip`}
        multiple
        value={stateList}
        open={filterOpen}
        onOpen={handleOpenSelect}
        onClose={handleOpenSelect}
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
        {filterOpen && list.length ? list.map(item => (
          // change the below line depending on the usage
          <MenuItem key={item.id} value={item.name || item.shortDesc}>
            {item.name || item.shortDesc}
          </MenuItem>
        )) : (
          <MenuItem value="loading">
             Loading
          </MenuItem>
        )}
      </Select>
      {Boolean(stateList.length) && (
        <Button size="small" onClick={resetFilter}>Clear Filter</Button>
      )}
    </FormControl>
  )
}


FilterComponent.defaultProps = {
  list: []
}

FilterComponent.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  stateList: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  resetFilter: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}
