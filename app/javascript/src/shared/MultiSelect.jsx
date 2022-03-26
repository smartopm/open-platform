import React from 'react';
import PropTypes from 'prop-types';
import {
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Chip,
  ListItemText,
  Select,
  Input
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

export default function MultiSelect({
  labelName,
  options,
  selectedOptions,
  handleOnChange,
  fieldName,
  type
}) {
  const classes = useStyles();

  function renderValue(selected) {
    if(type === 'chip') {
      return(
        <div className={classes.chips}>
          {selected.map((value) => (
            <Chip key={value} label={value} className={classes.chip} />
        ))}
        </div>
      )
    }
    return(selected.join(', '))
  }


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
        renderValue={selected => renderValue(selected)}
        style={{ width: '300px' }}
        className={fieldName === 'display_on' ? classes.displayOnMenu : ''}
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

const useStyles = makeStyles(() => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: '0.125em',
    backgroundColor: '#EDEDED'
  },
  displayOnMenu: {
    paddingTop: '7px',
    paddingBottom: '10px'
  }
}));

MultiSelect.defaultProps = {
  type: 'tag'
}

MultiSelect.propTypes = {
  labelName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  type: PropTypes.string
};
