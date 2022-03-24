import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Edit from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';

export default function EditableField({ value, setValue, action, customStyles, canUpdateNote }) {
  const [isEditMode, setIsEditMode] = useState(false);

  function handleChange(event) {
    setValue(event.target.value);
  }

  // Avoid always showing the update button after editing
  function handleOutsideClick() {
    setIsEditMode(false);
  }

  function handleClick() {
    setIsEditMode(true);
  }
  const classes = useStyles();
  return (
    <Grid container spacing={1} onMouseOver={handleClick} onMouseLeave={handleOutsideClick} data-testid="editable_field_section">
      <Grid item xs={10}>
        <TextField
          name="email"
          value={value}
          margin="normal"
          fullWidth
          onChange={handleChange}
          disabled={!isEditMode}
          className={classes.textField}
          multiline
          rows={1}
          style={{ ...customStyles, width: '100%' }}
          InputProps={{
            classes: {
              disabled: classes.disabled
            },
            'data-testid': 'editable_description',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClick}
                  data-testid="edit_icon"
                  color="primary"
                  disabled={!canUpdateNote}
                  size="large"
                >
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

EditableField.defaultProps = {
  customStyles: {}
}

EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  action: PropTypes.node.isRequired,
   // eslint-disable-next-line react/forbid-prop-types
  customStyles: PropTypes.object,
  canUpdateNote: PropTypes.bool.isRequired
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
