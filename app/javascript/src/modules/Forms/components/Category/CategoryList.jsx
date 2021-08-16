import React, { useState } from 'react';
import {
  Button,
  Container
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import { DetailsDialog } from '../../../../components/Dialog';
import CategoryForm from './CategoryForm';
import CategoryItem from './CategoryItem';
import { FormCategoriesQuery } from '../../graphql/form_category_queries';
import { Spinner } from '../../../../shared/Loading';

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
    properties: [],
    general: false
  },
  {
    id: 2,
    name: 'General Category',
    order: 2,
    description: 'Some General Category Description here',
    headerVisible: false,
    renderedText: 'This will initially be a very long text that looks similar to a contract',
    properties: [],
    general: false
  }
];

const initialData = {
    name: '',
    order: 0,
    description: '',
    headerVisible: false,
    renderedText: '',
    general: false
  };
export default function CategoryList({ handleAddField }) {
  const [formOpen, setFormOpen] = useState(false);
  const [data, setFormData] = useState({})
  const { formId } = useParams()
  const categoriesData = useQuery(FormCategoriesQuery, {
    variables: { formId },
    fetchPolicy: "cache-and-network"
  })

  function handleEditCategory(category) {
    console.log(category);
    setFormOpen(true)
    setFormData(category)
  }
  function handleAddCategory() {
    console.log('adding a cateogy');
    setFormOpen(true)
    setFormData(initialData)
  }

  function handleClose(){
    setFormOpen(false)
  }
// console.log(categoriesData.data.formCategories)
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={formOpen}
        title="Category"
        color="default"
      >
        <Container>
          <CategoryForm data={data} close={handleClose} refetchCategory={categoriesData.refetch} />
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
      {
        categoriesData.loading && <Spinner />
      }
      {categoriesData?.data && categoriesData.data?.formCategories.map(category => (
        <CategoryItem
          name={category.fieldName}
          key={category.id}
          handleAddField={() => handleAddField(category.id)}
          handleEditCategory={() => handleEditCategory(category)}
        />
      ))}
    </>
  );
}


CategoryList.propTypes = {
  handleAddField: PropTypes.func.isRequired,
};

