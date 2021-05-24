import React from 'react';
import { makeStyles } from '@material-ui/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function AddMoreButton({ handleAdd, title }) {
  const classes = useStyles();
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className={classes.addIcon} tabIndex={0} role="button" onClick={handleAdd}>
      <AddCircleOutlineIcon color="primary" />
      <div style={{ marginLeft: '6px' }}>
        <Typography align="center" variant="caption" color="primary">
          {title}
        </Typography>
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  addIcon: {
    display: 'flex',
    marginTop: '20px',
    cursor: 'pointer'
  }
}));

AddMoreButton.propTypes = {
  handleAdd: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};
