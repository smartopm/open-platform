import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function EditableField({ value, setValue, action }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);

  function handleChange(event) {
    setValue(event.target.value);
  }

  function handleMouseInAndOut() {
    setMouseOver(!mouseOver);
  }

  // Avoid always showing the update button after editing
  function handleOutsideClick(){
      setIsEditMode(false);
  }

  function handleClick() {
    setIsEditMode(true);
    setMouseOver(false);
  }
  const classes = useStyles();

  return (
    <Grid container onMouseLeave={handleOutsideClick} data-testid="editable_field_section">
      <Grid item xs={10}>
        <TextField
          name="email"
          value={value}
          margin="normal"
          fullWidth
          onChange={handleChange}
          disabled={!isEditMode}
          className={classes.textField}
          onMouseEnter={handleMouseInAndOut}
          multiline
          rowsMax={2}
          style={{ width: '100%' }}
          InputProps={{
            classes: {
              disabled: classes.disabled
            },
            'data-testid':'editable_description',
            endAdornment: mouseOver && (
              <InputAdornment position="end">
                <IconButton onClick={handleClick} data-testid="edit_icon">
                  <Edit />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      {isEditMode && (
        <Grid item xs={2} data-testid="edit_action">
          {action}
        </Grid>
      )}
    </Grid>
  );
}

EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  action: PropTypes.node.isRequired
};

const useStyles = makeStyles(() => ({
  textField: {
    width: 300,
    color: 'black',
    fontSize: 30,
    opacity: 1,
    borderBottom: 0,
    '&:before': {
      borderBottom: 0
    }
  },
  disabled: {
    color: 'black',
    borderBottom: 0,
    '&:before': {
      borderBottom: 0
    }
  }
}));