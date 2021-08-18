import React, { useState, useContext } from 'react';
import { Button, Container, DialogContent, DialogContentText } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DetailsDialog } from '../../../../components/Dialog';
import CategoryForm from './CategoryForm';
import { FormCategoriesQuery } from '../../graphql/form_category_queries';
import { Spinner } from '../../../../shared/Loading';
import FormTitle from '../FormTitle';
import { FormQuery } from '../../graphql/forms_queries';
import { FormContext } from '../../Context';
import CenteredContent from '../../../../components/CenteredContent';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { flattenFormProperties } from '../../utils';
import CategoryList from './CategoryList';
import FormPreview from '../FormPreview';
import MessageAlert from '../../../../components/MessageAlert';
import { FormCategoryDeleteMutation } from '../../graphql/form_category_mutations';
import { formatError } from '../../../../utils/helpers';

// This will contain the main category
// from the main category you should be able to add questions to that category
// below the main category, you can add another category

export default function Form({ editMode }) {
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [propertyFormOpen, setPropertyFormOpen] = useState(false);
  const [data, setFormData] = useState({});
  const { t } = useTranslation(['common', 'form']);
  const [categoryId, setCategoryId] = useState('');
  const { formId } = useParams();
  const categoriesData = useQuery(FormCategoriesQuery, {
    variables: { formId },
    fetchPolicy: 'cache-and-network'
  });
  const { data: formDetailData, loading } = useQuery(FormQuery, { variables: { id: formId } });
  const { formState, saveFormData, setFormState } = useContext(FormContext);
  const authState = useContext(Context);
  const history = useHistory()
  const [categoryDelete, { loading: isDeleting, error }] = useMutation(FormCategoryDeleteMutation)

  function handleEditCategory(category) {
    setCategoryFormOpen(true);
    setFormData(category);
  }
  function handleAddCategory() {
    setCategoryFormOpen(true);
    const init = {
      fieldName: '',
      description: '',
      headerVisible: false,
      general: false,
      order: 1,
      renderedText: ''
    }
    setFormData(init);
  }

  function handleDeleteCategory(category) {
    categoryDelete({
      variables: { categoryId: category, formId }
    }).then((res) => {
      const formPropResponse = res.data.categoryDelete;
      if (formPropResponse.message === 'New version created') {
        history.push(`/edit_form/${formPropResponse.newFormVersion.id}`);
      }
      categoriesData.refetch()
    })
  }

  function handleAddField(catId) {
    setCategoryId(catId);
    setPropertyFormOpen(!propertyFormOpen);
  }

  function handleCategoryClose() {
    setCategoryFormOpen(false);
  }

  function handleCancelPreview() {
    setFormState({ ...formState, previewable: false });
  }

  function formSubmit(propertiesData) {
    if (formDetailData.form?.preview) {
      setFormState({ ...formState, previewable: formDetailData.form?.preview });
      return;
    }
    saveFormData(propertiesData, formId, authState.user.id);
  }

  const formData = flattenFormProperties(categoriesData.data?.formCategories);

  return (
    <>
      <MessageAlert
        type={formState.error || error ? 'error' : 'success'}
        message={formState.info || formatError(error?.message)}
        open={formState.alertOpen || !!error}
        handleClose={() => setFormState({ ...formState, alertOpen: false })}
      />
      <DetailsDialog
        handleClose={handleCategoryClose}
        open={categoryFormOpen}
        title={t('form:misc.category')}
        color="default"
      >
        <Container>
          <CategoryForm
            data={data}
            close={handleCategoryClose}
            refetchCategories={categoriesData.refetch}
          />
        </Container>
      </DetailsDialog>

      <DetailsDialog
        handleClose={handleCancelPreview}
        open={formState.previewable}
        title={t('form:misc.contract_preview')}
        color="default"
        scroll="paper"
      >
        <DialogContent dividers>
          <DialogContentText component="div">
            <FormPreview
              loading={formState.isSubmitting}
              handleFormSubmit={() => saveFormData(formData, formId, authState.user.id)}
            />
          </DialogContentText>
        </DialogContent>
      </DetailsDialog>
      <br />

      {loading && <Spinner />}

      {!loading && formDetailData && (
        <FormTitle
          name={formDetailData.form?.name}
          description={formDetailData.form?.description}
        />
      )}

      <CategoryList
        categoriesData={categoriesData}
        editMode={editMode}
        formId={formId}
        propertyFormOpen={propertyFormOpen}
        categoryId={categoryId}
        categoryItem={{ handleAddField, handleEditCategory, handleDeleteCategory }}
        loading={isDeleting}
      />
      <br />
      {editMode && (
        <Button
          variant="outlined"
          color="default"
          startIcon={<AddIcon color="primary" />}
          style={{ float: 'right' }}
          onClick={handleAddCategory}
        >
          {t('form:actions.add_category')}
        </Button>
      )}
      {!editMode && (
        <CenteredContent>
          <Button
            variant="outlined"
            type="submit"
            color="primary"
            aria-label="form_submit"
            style={{ marginTop: '25px' }}
            onClick={() => formSubmit(formData)}
          >
            {t('common:form_actions.submit')}
          </Button>
        </CenteredContent>
      )}
    </>
  );
}

Form.propTypes = {
  editMode: PropTypes.bool.isRequired
};
