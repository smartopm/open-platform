import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';

export default function TextFieldLiveEdit({
  text,
  textVariant,
  styles,
  textFieldVariant,
  fullWidth
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
          {text}
        </Typography>
      ) : (
        <TextField
          placeholder={text}
          onMouseOut={() => setEdit(false)}
          variant={textFieldVariant}
          fullWidth
          color='primary'
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
