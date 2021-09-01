import React from 'react';
import PropTypes from 'prop-types';
import {
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Select,
  Input
} from '@material-ui/core';

export default function MultiSelect({
  labelName,
  options,
  selectedOptions,
  handleOnChange,
  fieldName
}) {
  return (
    <FormControl>
      <InputLabel id="demo-mutiple-checkbox-label">{labelName}</InputLabel>
      <Select
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        multiple
        value={selectedOptions || []}
        onChange={handleOnChange}
        input={<Input />}
        name={fieldName}
        renderValue={selected => selected.join(', ')}
        style={{ width: '300px' }}
      >
        {options.map(option => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={selectedOptions?.indexOf(option) > -1} color="primary" />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

MultiSelect.propTypes = {
  labelName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired
};
