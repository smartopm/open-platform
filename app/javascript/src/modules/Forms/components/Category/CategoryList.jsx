import React, { useState , useContext } from 'react';
import { Button, Container } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DetailsDialog } from '../../../../components/Dialog';
import CategoryForm from './CategoryForm';
import CategoryItem from './CategoryItem';
import { FormCategoriesQuery } from '../../graphql/form_category_queries';
import { Spinner } from '../../../../shared/Loading';
import RenderForm from '../RenderForm';
import FormPropertyCreateForm from '../FormPropertyCreateForm';
import FormTitle from '../FormTitle';
import { FormQuery } from '../../graphql/forms_queries';
import { FormContext } from '../../Context';
import CenteredContent from '../../../../components/CenteredContent';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

// This will contain the main category
// from the main category you should be able to add questions to that category
// below the main category, you can add another category

export default function CategoryList({ editMode }) {
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [propertyFormOpen, setPropertyFormOpen] = useState(false);
  const [data, setFormData] = useState({});
  const { t } = useTranslation('common')
  const [categoryId, setCategoryId] = useState('');
  const { formId } = useParams();
  const categoriesData = useQuery(FormCategoriesQuery, {
    variables: { formId },
    fetchPolicy: 'cache-and-network'
  });
  const { data: formDetailData, loading } = useQuery(FormQuery, { variables: { id: formId } });
  const { formState, saveFormData } = useContext(FormContext)
  const authState = useContext(Context);

  function handleEditCategory(category) {
    setCategoryFormOpen(true);
    setFormData(category);
  }
  function handleAddCategory(category) {
    setCategoryFormOpen(true);
    setFormData(category);
  }

  function handleAddField(catId) {
    setCategoryId(catId);
    setPropertyFormOpen(!propertyFormOpen);
  }

  function handleClose() {
    setCategoryFormOpen(false);
  }
  const formData = []

  return (
    <>
      <DetailsDialog handleClose={handleClose} open={categoryFormOpen} title="Category" color="default">
        <Container>
          <CategoryForm data={data} close={handleClose} refetchCategories={categoriesData.refetch} />
        </Container>
      </DetailsDialog>
      <br />

      {loading && <Spinner />}

      {!loading && formDetailData && (
        <FormTitle name={formDetailData.form?.name} description={formDetailData.form?.description} />
      )}

      {categoriesData.loading && <Spinner />}
      {categoriesData?.data &&
        categoriesData.data?.formCategories.map(category => (
          <CategoryItem
            name={category.fieldName}
            key={category.id}
            handleAddField={() => handleAddField(category.id)}
            handleEditCategory={() => handleEditCategory(category)}
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
      <br />
      {
        editMode && (
          <Button
            variant="outlined"
            color="default"
            startIcon={<AddIcon color="primary" />}
            style={{ float: 'right' }}
            onClick={handleAddCategory}
          >
            Add Category
          </Button>
        )
      }
      {
        !editMode && (
          <CenteredContent>
            <Button
              variant="outlined"
              type="submit"
              color="primary"
              aria-label="form_submit"
              disabled={formState.isSubmitting}
              style={{ marginTop: '25px' }}
              onClick={() => saveFormData(formData, formId, authState.user.id)}
            >
              {formState.isSubmitting
                  ? t('common:form_actions.submitting')
                  : t('common:form_actions.submit')
            }
            </Button>
          </CenteredContent>
        )
      }
    </>
  );
}

CategoryList.propTypes = {
  editMode: PropTypes.bool.isRequired
}