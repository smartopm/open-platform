import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

export default function TextFieldLiveEdit({
  text,
  placeHolderText,
  textVariant,
  styles,
  textFieldVariant,
  fullWidth,
  handleChange,
  name,
  multiline,
  rows
}) {
  const [edit, setEdit] = useState(false);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {!edit ? (
        <Typography
          onMouseOver={() => setEdit(true)}
          onClick={() => setEdit(true)}
          styles={styles}
          variant={textVariant}
          color="textSecondary"
          className={classes.typography}
          data-testid="live-field-text"
        >
          {text === '' ? placeHolderText : text}
        </Typography>
      ) : (
        <TextField
          placeholder={placeHolderText}
          onMouseOut={() => setEdit(false)}
          variant={textFieldVariant}
          fullWidth={fullWidth}
          multiline={multiline}
          rows={rows}
          color="primary"
          value={text}
          onChange={e => handleChange(e)}
          name={name}
          data-testid="live-field-input"
        />
      )}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: '20px'
  },
  typography: {
    fontWeight: '300'
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
  textVariant: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  textFieldVariant: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  multiline: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
