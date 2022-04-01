import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CategoryItem from './CategoryItem';
import RenderForm from '../RenderForm';
import FormPropertyCreateForm from '../FormPropertyCreateForm';
import { Spinner } from '../../../../shared/Loading';
import { sortPropertyOrder } from '../../../../utils/helpers';

export default function CategoryList({
  categoriesData,
  editMode,
  formId,
  propertyFormOpen,
  categoryId,
  categoryItem,
  loading
}) {
  // to only show a loader on category that is being deleted
  const [currentId, setCurrentId] = useState('');
  if (categoriesData.loading) {
    return <Spinner />;
  }

  function handleRemoveCategory(id) {
    setCurrentId(id);
    categoryItem.handleDeleteCategory(id);
  }

  return (
    <>
      {categoriesData?.data &&
        categoriesData.data?.formCategories.map(category => (
          <CategoryItem
            category={category}
            key={category.id}
            handleAddField={() => categoryItem.handleAddField(category.id)}
            handleDeleteCategory={() => handleRemoveCategory(category.id)}
            handleEditCategory={() => categoryItem.handleEditCategory(category)}
            collapsed={propertyFormOpen && categoryId === category.id}
            editMode={editMode}
            loading={loading}
            currentId={currentId}
          >
            {propertyFormOpen && categoryId === category.id && editMode && (
              <FormPropertyCreateForm
                formId={formId}
                refetch={categoriesData.refetch}
                categoryId={category.id}
              />
            )}
            {category.formProperties.sort(sortPropertyOrder).map((formProperty, index) => (
              <RenderForm
                key={formProperty.id}
                formPropertiesData={formProperty}
                formId={formId}
                refetch={categoriesData.refetch}
                categoryId={category.id}
                editMode={editMode}
                number={index + 1}
              />
            ))}
          </CategoryItem>
        ))}
    </>
  );
}

CategoryList.defaultProps = {
  propertyFormOpen: false
};

CategoryList.propTypes = {
  categoriesData: PropTypes.shape({
    refetch: PropTypes.func,
    loading: PropTypes.bool,
    data: PropTypes.shape({
      formCategories: PropTypes.arrayOf(
        PropTypes.shape({
          fieldName: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired
        })
      )
    })
  }).isRequired,
  editMode: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  formId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  propertyFormOpen: PropTypes.bool,
  categoryItem: PropTypes.shape({
    handleAddField: PropTypes.func,
    handleEditCategory: PropTypes.func,
    handleDeleteCategory: PropTypes.func
  }).isRequired
};
