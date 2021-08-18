import React from 'react';
import PropTypes from 'prop-types';
import CategoryItem from './CategoryItem';
import RenderForm from '../RenderForm';
import FormPropertyCreateForm from '../FormPropertyCreateForm';
import { Spinner } from '../../../../shared/Loading';

export default function CategoryList({
  categoriesData,
  editMode,
  formId,
  propertyFormOpen,
  categoryId,
  categoryItem
}) {
  if (categoriesData.loading) {
    return <Spinner />;
  }
  return (
    <>
      {categoriesData?.data &&
        categoriesData.data?.formCategories.map(category => (
          <CategoryItem
            name={category.fieldName}
            key={category.id}
            handleAddField={() => categoryItem.handleAddField(category.id)}
            handleEditCategory={() => categoryItem.handleEditCategory(category)}
            collapsed={propertyFormOpen && categoryId === category.id}
            editMode={editMode}
          >
            {category.formProperties.map(formProperty => (
              <RenderForm
                key={formProperty.id}
                formPropertiesData={formProperty}
                formId={formId}
                refetch={categoriesData.refetch}
                categoryId={category.id}
                editMode={editMode}
              />
            ))}
            {propertyFormOpen && categoryId === category.id && editMode && (
              <FormPropertyCreateForm
                formId={formId}
                refetch={categoriesData.refetch}
                categoryId={category.id}
              />
            )}
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
  formId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  propertyFormOpen: PropTypes.bool,
  categoryItem: PropTypes.shape({
    handleAddField: PropTypes.func,
    handleEditCategory: PropTypes.func
  }).isRequired
};
