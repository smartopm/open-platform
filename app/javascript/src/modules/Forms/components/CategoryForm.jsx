import React, { useState } from 'react';
import {
  Button,
  Grid,
  IconButton,
  Typography,
  TextField,
  Container
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import { useTranslation } from 'react-i18next';
import SwitchInput from './SwitchInput';
import CenteredContent from '../../../components/CenteredContent';
import { DetailsDialog } from '../../../components/Dialog';

// This will contain the main category
// from the main category you should be able to add questions to that category
// below the main category, you can add another category
export const categories = [
  {
    id: 1,
    name: 'Main',
    order: 1,
    description: 'Some Description here',
    headerVisible: true,
    renderedText: 'This will initially be a very long text that looks similar to a contract',
    properties: []
  },
  {
    id: 2,
    name: 'General Category',
    order: 2,
    description: 'Some General Category Description here',
    headerVisible: false,
    renderedText: 'This will initially be a very long text that looks similar to a contract',
    properties: []
  }
];

const initialData = {
    name: '',
    order: 0,
    description: '',
    headerVisible: false,
    renderedText: ''
  };
export default function CategoryList({ handleAddField }) {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setFormData] = useState({})

  function handleEditCategory(catId) {
    console.log(catId);
    setFormOpen(true)
    setFormData(categories.find(cat => cat.id === catId))
  }
  function handleAddCategory() {
    console.log('adding a cateogy');
    setFormOpen(true)
    setFormData(initialData)
  }
  return (
    <>
      <DetailsDialog
        handleClose={() => setFormOpen(false)}
        open={formOpen}
        title="Category"
        color="default"
      >
        <Container>
          <CategoryForm data={data} />
        </Container>
      </DetailsDialog>
      <Button
        variant="outlined"
        color="default"
        startIcon={<AddIcon color="primary" />}
        style={{ float: 'right' }}
        onClick={handleAddCategory}
      >
        Add Category
      </Button>
      <br />
      {categories.map(category => (
        <Category
          name={category.name}
          key={category.id}
          handleAddField={() => handleAddField(category.id)}
          handleEditCategory={() => handleEditCategory(category.id)}
        />
      ))}
    </>
  );
}

export function Category({ name, handleAddField, handleEditCategory }) {
  // This should handle the creation of the category
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

export function CategoryForm({ data }) {
  const { t } = useTranslation('form');

  const [categoryData, setCategoryData] = useState(data || initialData);

  function handleSaveCategory() {}

  function handleChange(event) {
    const { name, value } = event.target;
    setCategoryData({
      ...categoryData,
      [name]: value
    });
  }

  function handleRadioChange(event) {
    const { name, checked } = event.target;
    setCategoryData({
      ...categoryData,
      [name]: checked
    });
  }

  return (
    <form onSubmit={handleSaveCategory} data-testid="form_property_submit">
      <TextField
        id="cat-name"
        label={t('form_fields.name')}
        variant="outlined"
        value={categoryData.name}
        onChange={handleChange}
        name="name"
        style={{ width: '100%' }}
        inputProps={{ 'data-testid': 'name' }}
        margin="dense"
        autoFocus
        required
      />
      <TextField
        id="cat-description"
        label={t('form_fields.description')}
        variant="outlined"
        value={categoryData.description}
        onChange={handleChange}
        name="description"
        style={{ width: '100%' }}
        inputProps={{ 'data-testid': 'description' }}
        margin="dense"
        required
      />
      <TextField
        id="cat-rendered_text"
        label={t('form_fields.rendered_text')}
        variant="outlined"
        value={categoryData.renderedText}
        onChange={handleChange}
        name="renderedText"
        style={{ width: '100%' }}
        inputProps={{ 'data-testid': 'rendered_text' }}
        margin="dense"
        rows={3}
        required
        multiline
      />

      <div style={{ marginTop: 20 }}>
        <SwitchInput
          name="required"
          label={t('form:form_fields.header_visible')}
          value={categoryData.headerVisible}
          handleChange={handleRadioChange}
        />
        <TextField
          id="cat-order"
          label={t('form_fields.order_number')}
          value={categoryData.order}
          onChange={handleChange}
          variant="outlined"
          size="small"
          name="order"
          style={{ marginLeft: 20 }}
        />
      </div>
      <br />
      <CenteredContent>
        <Button
          variant="outlined"
          type="submit"
          color="primary"
          // disabled={isLoading}
          // startIcon={isLoading && <Spinner />}
        >
          {/* {!propertyId ? t('actions.add_form_property') : t('actions.update_property')} */}
          Save Category
        </Button>
      </CenteredContent>
    </form>
  );
}

Category.propTypes = {
  name: PropTypes.string.isRequired,
  handleAddField: PropTypes.func.isRequired,
  handleEditCategory: PropTypes.func.isRequired
};

CategoryList.propTypes = {
  handleAddField: PropTypes.func.isRequired
};


CategoryForm.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    order: PropTypes.number,
    description: PropTypes.string,
    headerVisible: PropTypes.bool,
    renderedText: PropTypes.string
  }).isRequired
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
