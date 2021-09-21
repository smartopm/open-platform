import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default function BackArrow({ path }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const history = useHistory();
  return (
    <>
      {path !== '/' && (
        <IconButton className={classes.body} color='primary' data-testid='arrow' style={matches ? {marginLeft: '-30px'} : {}} onClick={() => history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
      )}
    </>
  );
}

const useStyles = makeStyles(() => ({
  body: {
    marginTop: '-15px'
  }
}));

BackArrow.propTypes = {
  path: PropTypes.string.isRequired
};