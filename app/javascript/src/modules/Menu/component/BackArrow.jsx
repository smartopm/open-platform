import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackArrow({ path }) {
  const classes = useStyles();
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const history = useHistory();

  return (
    <>
      {path !== '/' && !matches && (
      <IconButton
        className={classes.body}
        color='primary'
        data-testid='arrow'
        onClick={() => history.goBack()}
        size="large"
      >
        <ArrowBackIcon />
      </IconButton>
    )}
    </>
);
}

const useStyles = makeStyles(() => ({
  body: {
    marginTop: '-8px'
  }
}));

BackArrow.propTypes = {
  path: PropTypes.string.isRequired
};
