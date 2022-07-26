import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { removeNewLines, sanitizeText } from '../utils/helpers';

export default function AutoSaveField({ value, mutationAction, label, fieldType, canEdit }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    if(value) {
      setInput(value)
    }
  }, [value])

  function handleMouseLeave() {
    setIsEditMode(false);
    handleAutoSave();
  }

  function handleMouseOver() {
    if(canEdit){
      setIsEditMode(true);
    }
  }

  function handleAutoSave() {
    const previous = value;
    if (input && input !== previous) {
      mutationAction(input);
    }
  }

  const classes = useStyles();

  return (
    <>
      {fieldType === 'inline'
      ? (
        <Grid container>
          <Grid item xs={12}>
            <ContentEditable
              value={input}
              isEditMode={isEditMode}
              setIsEditMode={(v) => setIsEditMode(v)}
              handleMouseOver={handleMouseOver}
              mutationAction={mutationAction}
            />
          </Grid>
        </Grid>
      )
      : ( 
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
)
    }
     
    </>
  );
}

export function ContentEditable({ value, isEditMode, setIsEditMode, handleMouseOver, mutationAction }){
  function handleContentEditLeave(e){
    const previous = value
    const input = sanitizeText(removeNewLines(e.target.textContent))
    
    setIsEditMode(false);
    if(input && input !== previous){
      mutationAction(input)
    }
  }

  return (
    <div
      contentEditable
      data-testid="inline-editable-field"
      onMouseOver={handleMouseOver}
      onFocus={handleMouseOver}
      onMouseLeave={handleContentEditLeave}
      style={{
        height: 'auto',
        paddingLeft: '3px',
        paddingTop: '12px',
        paddingBottom: '12px',
        outline: `${isEditMode ? 'solid 1px #575757' : 'none'}`,
        borderRadius: '4px'
      }}
      dangerouslySetInnerHTML={{
        __html: sanitizeText(removeNewLines(value))
      }}
    />
  )
}

AutoSaveField.defaultProps = {
  value: '',
  label: '',
  fieldType: 'text',
  canEdit: false,
};

AutoSaveField.propTypes = {
  value: PropTypes.string,
  mutationAction: PropTypes.func.isRequired,
  label: PropTypes.string,
  canEdit: PropTypes.bool,
  fieldType: PropTypes.string,
};

ContentEditable.propTypes = {
  value: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  setIsEditMode: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  mutationAction: PropTypes.func.isRequired,
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
