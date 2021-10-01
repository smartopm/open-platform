import React, { useContext } from 'react';
import { Container, Grid, IconButton, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { DeleteOutline } from '@material-ui/icons';
import { Spinner } from '../../../../shared/Loading';
import { checkCondition , extractValidFormPropertyValue } from '../../utils';
import { FormContext } from '../../Context';

export default function CategoryItem({
  category,
  handleAddField,
  handleEditCategory,
  handleDeleteCategory,
  children,
  collapsed,
  editMode,
  loading,
  currentId,
}) {
  const classes = useStyles();
  const { formProperties } = useContext(FormContext)
  const properties = extractValidFormPropertyValue(formProperties)
  
  if(!checkCondition(category, properties, editMode)){
    return null
  }
  return (
    <>
      {(!category.headerVisible && !editMode) ? null : (
        <Grid container className={classes.categorySection}>
          <Grid item xs={6} sm={9}>
            <Typography className={classes.categoryName}>{category.fieldName}</Typography>
          </Grid>
          <Grid item xs={2} sm={1}>
            {editMode && (
              <IconButton aria-label="delete this category" onClick={handleDeleteCategory}>
                {loading && currentId === category.id ? (
                  <Spinner />
                ) : (
                  <DeleteOutline color="primary" />
                )}
              </IconButton>
            )}
          </Grid>
          <Grid item xs={2} sm={1}>
            {editMode && (
              <IconButton aria-label="edit this category" onClick={handleEditCategory}>
                <CreateIcon color="primary" />
              </IconButton>
            )}
          </Grid>
          <Grid item xs={2} sm={1}>
            {editMode && (
              <IconButton aria-label="add questions to this category" onClick={handleAddField} className="form-category-add-field-btn">
                {collapsed ? (
                  <CloseIcon color="primary" />
                ) : (
                  <AddIcon color="primary" data-testid="add-icon" />
                )}
              </IconButton>
            )}
          </Grid>
        </Grid>
      )}
      <Container>{children}</Container>
    </>
  );
}

CategoryItem.propTypes = {
  category: PropTypes.shape({
    fieldName: PropTypes.string,
    headerVisible: PropTypes.bool,
    id: PropTypes.string
  }).isRequired,
  handleAddField: PropTypes.func.isRequired,
  handleEditCategory: PropTypes.func.isRequired,
  handleDeleteCategory: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  currentId: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  categorySection: {
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderRadius: 5,
    marginTop: 22
  },
  categoryName: {
    padding: 13
  }
});
