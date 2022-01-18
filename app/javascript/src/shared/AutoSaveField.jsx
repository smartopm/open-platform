import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import useDebounce from '../utils/useDebounce';

export default function AutoSaveField({ value, mutationAction, stateAction }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [input, setInput] = useState(value || '')
  const [isTyping, setIsTyping] = useState(true);
  const debouncedValue = useDebounce(input, 500)

  function handleMouseLeave() {
    setIsEditMode(false);
    stateAction(false)
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
          InputProps={{
            'data-testid': 'live_editable_description',
          }}
        />
      </Grid>
      {isEditMode && !isTyping && <AutoSave previous={value} data={debouncedValue} autoSaveAction={(data) => mutationAction(data)} />}
    </Grid>
  );
}

export function AutoSave({ data, autoSaveAction, delay, previous}) {
  const wait = delay || 1000;
  
  const memoisedAction = useCallback((value) => {
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


AutoSaveField.defaultProps = {
  stateAction: () => {}
}

AutoSaveField.propTypes = {
  value: PropTypes.string.isRequired,
  mutationAction: PropTypes.func.isRequired,
  stateAction: PropTypes.func,
};

AutoSave.defaultProps = {
  delay: null,
}

AutoSave.propTypes = {
  data: PropTypes.string.isRequired,
  previous: PropTypes.string.isRequired,
  delay: PropTypes.number,
  autoSaveAction: PropTypes.func.isRequired,
};

const useStyles = makeStyles(() => ({
  liveTextField: {},
  disabled: {
    borderBottom: 0,
    '&:before': {
      borderBottom: 0
    }
  }
}));
