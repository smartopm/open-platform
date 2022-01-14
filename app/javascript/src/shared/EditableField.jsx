import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import useDebounce from '../utils/useDebounce';
import { sanitizeText } from '../utils/helpers';

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
                <IconButton onClick={handleClick} data-testid="edit_icon" color="primary" disabled={!canUpdateNote}>
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

export function LiveEditableField({ value, action, handleSetEditTaskBody }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [input, setInput] = useState(value || '')
  const [isTyping, setIsTyping] = useState(true);
  const debouncedValue = useDebounce(input, 500)

  function handleMouseLeave() {
    setIsEditMode(false);
    handleSetEditTaskBody(false)
  }

  function handleMouseOver() {
    setIsEditMode(true);
  }

  const classes = useStyles();

  useEffect(() => {
    let timer = setTimeout(() => {}, 0);
    document.getElementById('live-text-field').addEventListener('keypress', function() {
      clearTimeout(timer);
      setIsTyping(true);
      timer = setTimeout(() => setIsTyping(false), 1000);
    });
  }, []);

  return (
    <Grid container onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} data-testid="live_editable_field">
      <Grid item xs={12}>
        <TextField
          id="live-text-field"
          name="live-text-field"
          value={input}
          fullWidth
          // onChange={handleChange}
          onChange={(e) => setInput(e.target.value)}
          disabled={!isEditMode}
          // className={classes.liveTextField}
          multiline
          variant="outlined"
          // rows={1}
          // style={{ ...customStyles, width: '100%' }}
          InputProps={{
            // classes: {
            //   disabled: classes.disabled
            // },
            // value: () => renderInput(),
            'data-testid': 'live_editable_description',
          }}
        />
      </Grid>
      {isEditMode && !isTyping && <AutoSave previous={value} data={debouncedValue} autoSaveAction={(data) => action(data)}/>}
    </Grid>
  );
}

function AutoSave({ data, autoSaveAction, delay, previous}) {
  const wait = delay || 1000;
  
  const memoisedAction = useCallback((value) => {
    console.log({ value })
    const handler = setTimeout(() => {
      autoSaveAction(value);
    }, wait);

    return () => {
      clearTimeout(handler);
    };
  },[])

  useEffect(() => {
    if(data && data !== previous) {
      memoisedAction(data)
    }
  }, [data])

  return null;
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

LiveEditableField.defaultProps = {
  handleSetEditTaskBody: () => {}
}

LiveEditableField.propTypes = {
  value: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  handleSetEditTaskBody: PropTypes.func,
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
