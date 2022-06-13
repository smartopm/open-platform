import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';

export default function AutoSaveField({ value, mutationAction, stateAction, label }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [input, setInput] = useState(value || '');

  function handleMouseLeave() {
    setIsEditMode(false);
    stateAction(false);
    handleAutoSave();
  }

  function handleMouseOver() {
    setIsEditMode(true);
  }

  function handleAutoSave() {
    const previous = value;
    if (input && input !== previous) {
      mutationAction(input);
    }
  }

  const classes = useStyles();

  return (
    <Grid
      container
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      data-testid="live_editable_field"
    >
      <Grid item xs={12}>
        <TextField
          id="live-text-field"
          name="live-text-field"
          value={input}
          fullWidth
          onChange={e => setInput(e.target.value)}
          className={classes.liveTextField}
          disabled={!isEditMode}
          multiline
          variant="outlined"
          label={label}
          inputProps={{ 'data-testid': 'live-text-field' }}
        />
      </Grid>
    </Grid>
  );
}
AutoSaveField.defaultProps = {
  stateAction: () => {},
  value: '',
  label: ''
};

AutoSaveField.propTypes = {
  value: PropTypes.string,
  mutationAction: PropTypes.func.isRequired,
  stateAction: PropTypes.func,
  label: PropTypes.string
};

const useStyles = makeStyles(() => ({
  liveTextField: {
    color: '#575757',
    letterSpacing: 0,
    lineHeight: '3em',
    fontSize: '1rem',
    fontWeight: '0'
  },
  disabled: {
    borderBottom: 0,
    '&:before': {
      borderBottom: 0
    }
  }
}));
