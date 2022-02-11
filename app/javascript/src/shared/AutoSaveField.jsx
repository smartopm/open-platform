import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import AutoSave from './AutoSave'
import useDebounce from '../utils/useDebounce';

export default function AutoSaveField({ value, mutationAction, stateAction }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [input, setInput] = useState(value || '')
  const [isTyping, setIsTyping] = useState(true);
  const debouncedValue = useDebounce(input, 500)

  function handleMouseLeave() {
    setIsEditMode(false);
    stateAction(false)
    handleAutoSave()
  }

  function handleMouseOver() {
    setIsEditMode(true);
  }

  function handleAutoSave(){
    const previous = value;
    if (debouncedValue !== previous){
      mutationAction(debouncedValue)
      // prevent reload of component
      // TODO: prevent reload of entire page
    }
  }

  const classes = useStyles();

  // useEffect(() => {
  //   let timer = setTimeout(() => {}, 0);
  //   document.getElementById('live-text-field').addEventListener('keypress', function() {
  //     clearTimeout(timer);
  //     setIsTyping(true);
  //     timer = setTimeout(() => setIsTyping(false), 1000);
  //   });

  //   return () => clearTimeout(timer);
  // }, []);

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
          onChange={(e) => setInput(e.target.value)}
          className={classes.liveTextField}
          disabled={!isEditMode}
          multiline
          variant="outlined"
          inputProps={{ 'data-testid': 'live-text-field' }}
        />
      </Grid>
      {/* {isEditMode && !isTyping && <AutoSave previous={value} data={debouncedValue} autoSaveAction={(data) => mutationAction(data)} />} */}
    </Grid>
  );
}
AutoSaveField.defaultProps = {
  stateAction: () => {}
}

AutoSaveField.propTypes = {
  value: PropTypes.string.isRequired,
  mutationAction: PropTypes.func.isRequired,
  stateAction: PropTypes.func,
};

const useStyles = makeStyles(() => ({
  liveTextField: {
    color: '#575757',
    letterSpacing: 0,
    lineHeight: '3em',
    fontSize: '1rem',
    fontWeight: '0',
  },
  disabled: {
    borderBottom: 0,
    '&:before': {
      borderBottom: 0
    }
  }
}));
