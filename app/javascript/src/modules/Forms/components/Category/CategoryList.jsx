import React, { useState } from 'react';
import {
  Button,
  Container
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { DetailsDialog } from '../../../../components/Dialog';
import CategoryForm from './CategoryForm';
import CategoryItem from './CategoryItem';

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
        <CategoryItem
          name={category.name}
          key={category.id}
          handleAddField={() => handleAddField(category.id)}
          handleEditCategory={() => handleEditCategory(category.id)}
        />
      ))}
    </>
  );
}


CategoryList.propTypes = {
  handleAddField: PropTypes.func.isRequired
};

