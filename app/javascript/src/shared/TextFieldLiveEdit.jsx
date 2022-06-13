import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import useClickAwayHook from '../utils/useClickAwayHook';

export default function TextFieldLiveEdit({
  text,
  placeHolderText,
  styles,
  textFieldVariant,
  fullWidth,
  handleChange,
  name,
  multiline,
  rows
}) {
  const [edit, setEdit] = useState(false);
  const [click, setClick] = useState(false);
  const classes = useStyles();
  const wrapperRef = useRef(null);
  useClickAwayHook(wrapperRef, handleClickAway);

  function handleClick() {
    if (!click) {
      setEdit(false);
    }
  }

  function handleClickAway() {
    setClick(false);
    setEdit(false);
  }

  return (
    <div className={classes.container} style={styles} ref={wrapperRef}>
      <TextField
        placeholder={placeHolderText}
        onMouseOver={() => setEdit(true)}
        onMouseOut={() => handleClick()}
        onClick={() => setClick(true)}
        label={edit ? placeHolderText : undefined}
        variant={textFieldVariant}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        color="primary"
        value={text}
        onChange={e => handleChange(e)}
        name={name}
        data-testid="live-field-input"
        InputProps={{
          classes: { notchedOutline: !edit ? classes.noBorder : undefined }
        }}
      />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: '20px'
  },
  typography: {
    fontWeight: '300'
  },
  noBorder: {
    border: 'none'
  }
}));

TextFieldLiveEdit.defaultProps = {
  styles: {},
  text: '',
  fullWidth: undefined,
  multiline: undefined,
  rows: undefined
};

TextFieldLiveEdit.propTypes = {
  text: PropTypes.string,
  placeHolderText: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  textFieldVariant: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  multiline: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
