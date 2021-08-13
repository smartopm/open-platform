import React from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';

export default function CategoryItem({ name, handleAddField, handleEditCategory }) {
  const classes = useStyles();
  return (
    <Grid container className={classes.categorySection}>
      <Grid item xs={8} sm={10}>
        <Typography className={classes.categoryName}>{name}</Typography>
      </Grid>
      <Grid item xs={2} sm={1}>
        <IconButton aria-label="edit this category" onClick={handleEditCategory}>
          <CreateIcon color="primary" />
        </IconButton>
      </Grid>
      <Grid item xs={2} sm={1}>
        <IconButton aria-label="add questions to this category" onClick={handleAddField}>
          <AddIcon color="primary" />
        </IconButton>
      </Grid>
    </Grid>
  );
}

CategoryItem.propTypes = {
  name: PropTypes.string.isRequired,
  handleAddField: PropTypes.func.isRequired,
  handleEditCategory: PropTypes.func.isRequired
};

const useStyles = makeStyles({
  categorySection: {
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderRadius: 5,
    marginTop: 20
  },
  categoryName: {
    padding: 13
  }
});
