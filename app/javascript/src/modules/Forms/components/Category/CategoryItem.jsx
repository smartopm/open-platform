import React, { useContext } from 'react';
import { Container, Grid, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { DeleteOutline } from '@mui/icons-material';
import { Spinner } from '../../../../shared/Loading';
import { checkCondition, extractValidFormPropertyValue } from '../../utils';
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
  currentId
}) {
  const classes = useStyles();
  const { formProperties } = useContext(FormContext);
  const properties = extractValidFormPropertyValue(formProperties);

  if (!checkCondition(category, properties, editMode)) {
    return null;
  }
  return (
    <>
      <Container>
        <Container style={{padding: '0 120px'}}>
          {!category.headerVisible && !editMode ? null : (
            <Grid container className={classes.categorySection}>
              <Grid item xs={6} sm={10}>
                <Typography className={classes.categoryName}>{category.fieldName}</Typography>
              </Grid>
              {/* <Grid item xs={2} sm={1}>
            {editMode && (
              <IconButton
                aria-label="delete this category"
                onClick={handleDeleteCategory}
                size="large"
              >
                {loading && currentId === category.id ? (
                  <Spinner />
                ) : (
                  <DeleteOutline color="primary" />
                )}
              </IconButton>
            )}
          </Grid> */}
              <Grid item xs={2} sm={1} className={classes.align}>
                {editMode && (
                <IconButton
                  aria-label="add questions to this category"
                  onClick={handleAddField}
                  className="form-category-add-field-btn"
                  size="large"
                >
                  {collapsed ? (
                    <Tooltip title="Hide">
                      <CloseIcon color="primary" />
                    </Tooltip>
                ) : (
                  <Tooltip title="Add a property">
                    <AddCircleOutlineIcon color="primary" data-testid="add-icon" />
                  </Tooltip>
                )}
                </IconButton>
            )}
              </Grid>
              <Grid item xs={2} sm={1} className={classes.align}>
                {editMode && (
                <IconButton aria-label="edit this category" size="large">
                  <MoreVertIcon color="primary" />
                </IconButton>
            )}
              </Grid>
            </Grid>
      )}
        </Container>
      </Container>
      <Container><Container><Container style={{padding: '0 150px'}}>{children}</Container></Container></Container>
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
  currentId: PropTypes.string.isRequired
};

const useStyles = makeStyles({
  categorySection: {
    background: '#FAFAFA',
    borderRadius: 5,
    marginTop: 22
  },
  categoryName: {
    padding: 13
  },
  align: {
    textAlign: 'right'
  }
});
