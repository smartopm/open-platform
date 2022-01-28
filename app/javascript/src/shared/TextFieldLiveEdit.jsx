import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';

export default function TextFieldLiveEdit({
  text,
  placeHolderText,
  textVariant,
  styles,
  textFieldVariant,
  fullWidth,
  handleChange,
  name
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
        >
          {text === '' ? placeHolderText : text}
        </Typography>
      ) : (
        <TextField
          placeholder={placeHolderText}
          onMouseOut={() => setEdit(false)}
          variant={textFieldVariant}
          fullWidth={fullWidth || undefined}
          color='primary'
          value={text}
          onChange={(e) => handleChange(e)}
          name={name}
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
