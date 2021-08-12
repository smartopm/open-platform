import React from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

// This will contain the main category
// from the main category you should be able to add questions to that category
// below the main category, you can add another category
export const categories = [
  {
    id: 1,
    name: 'Main',
    properties: [
      /*
              {
                  fieldName: '',
                  fieldValue: '',
                  required: false
              }
              */
    ]
  },
  {
    id: 2,
    name: 'General Category',
    properties: [
      /*
              {
                  fieldName: '',
                  fieldValue: '',
                  required: false
              }
              */
    ]
  },
];
export default function CategoryForm({ handleAddField }) {
  return (
    <div>
      {categories.map(category => (
        <Category name={category.name} key={category.id} handleAddField={() => handleAddField(category.id)} />
      ))}
    </div>
  );
}

export function Category({ name, handleAddField }) {
    // This should handle the creation of the category
  const classes = useStyles()
  return (
    <Grid container className={classes.categorySection}>
      <Grid item xs={8} sm={10}>
        <Typography className={classes.categoryName}>{name}</Typography>
      </Grid>
      <Grid item xs={2} sm={1}>
        <IconButton aria-label="create another category">
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

Category.propTypes = {
  name: PropTypes.string.isRequired,
  handleAddField: PropTypes.func.isRequired,
};

CategoryForm.propTypes = {
  handleAddField: PropTypes.func.isRequired,
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