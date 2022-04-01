import React, { useState, useContext, useEffect } from 'react';
import { Button, Container, DialogContent, DialogContentText, Grid, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DetailsDialog } from '../../../../components/Dialog';
import CategoryForm from './CategoryForm';
import { FormCategoriesQuery } from '../../graphql/form_category_queries';
import { Spinner } from '../../../../shared/Loading';
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
import FormHeader from '../FormHeader';

export default function Form({
  editMode,
  formId,
  property,
  isPublishing,
  handleConfirmPublish,
  formDetailData
}) {
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [propertyFormOpen, setPropertyFormOpen] = useState(false);
  const [data, setFormData] = useState({});
  const { t } = useTranslation(['common', 'form']);
  const [categoryId, setCategoryId] = useState('');
  const categoriesData = useQuery(FormCategoriesQuery, {
    variables: { formId },
    fetchPolicy: 'no-cache'
  });
  const { formState, saveFormData, setFormState } = useContext(FormContext);
  const authState = useContext(Context);
  const history = useHistory();
  const [categoryDelete, { loading: isDeleting, error }] = useMutation(FormCategoryDeleteMutation);

  function handleEditCategory(category) {
    setCategoryFormOpen(true);
    setFormData(category);
  }
  function handleAddCategory() {
    setCategoryFormOpen(true);
    setFormData({});
  }

  function handleDeleteCategory(category) {
    categoryDelete({
      variables: { categoryId: category, formId }
    }).then(res => {
      const formPropResponse = res.data.categoryDelete;
      if (formPropResponse.message === 'New version created') {
        history.push(`/edit_form/${formPropResponse.newFormVersion.id}`);
      }
      categoriesData.refetch();
    });
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

  function formSubmit(propertiesData, status) {
    if (formDetailData.form?.preview) {
      setFormState({ ...formState, previewable: formDetailData.form?.preview });
      return;
    }
    saveFormData(
      propertiesData,
      formId,
      authState.user.id,
      categoriesData.data?.formCategories,
      status
    );
  }

  useEffect(() => {
    if (formState?.successfulSubmit && !formState?.isDraft) {
      // Reset Form
      history.push(`/form/${formId}/${formDetailData.form?.name}`);
      window.location.reload();
    }
  }, [formState.successfulSubmit]);

  const formData = flattenFormProperties(categoriesData.data?.formCategories);

  return (
    <>
      {!editMode && (
        <FormHeader
          linkText={t('common:misc.forms')}
          linkHref="/forms"
          pageName={t('form:misc.submit_form')}
          PageTitle={t('form:misc.submit_form')}
        />
      )}
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
        color="primary"
      >
        <Container>
          <CategoryForm
            data={data}
            close={handleCategoryClose}
            formData={formData}
            refetchCategories={categoriesData.refetch}
          />
        </Container>
      </DetailsDialog>

      <DetailsDialog
        handleClose={handleCancelPreview}
        open={formState.previewable}
        title={t('form:misc.contract_preview')}
        color="primary"
        scroll="paper"
      >
        <DialogContent dividers>
          <DialogContentText component="div">
            <FormPreview
              loading={formState.isSubmitting}
              handleFormSubmit={() =>
                saveFormData(
                  formData,
                  formId,
                  authState.user.id,
                  categoriesData.data?.formCategories
                )
              }
              categoriesData={categoriesData}
            />
          </DialogContentText>
        </DialogContent>
      </DetailsDialog>
      <div
        data-testid="category-list-container"
        style={formState.isSubmitting ? { opacity: '0.3', pointerEvents: 'none' } : {}}
      >
        <CategoryList
          categoriesData={categoriesData}
          editMode={editMode}
          formId={formId}
          propertyFormOpen={propertyFormOpen}
          categoryId={categoryId}
          categoryItem={{ handleAddField, handleEditCategory, handleDeleteCategory }}
          loading={isDeleting}
        />
      </div>
      <br />
      {editMode && (
        <Grid container spacing={4}>
          <Grid item md={12} style={{ marginTop: '20px' }}>
            <Divider />
          </Grid>
          <Grid
            item
            md={!property ? 12 : 6}
            style={!property ? { textAlign: 'right' } : { textAlign: 'left' }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon color="primary" />}
              onClick={handleAddCategory}
              data-testid="add_category"
            >
              {t('form:actions.add_category')}
            </Button>
          </Grid>

          {Boolean(property) && (
            <Grid item md={6} style={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmPublish}
                disabled={isPublishing}
                startIcon={isPublishing && <Spinner />}
                style={{ color: 'white' }}
              >
                {isPublishing ? t('form:misc.publishing_form') : t('form:actions.publish_form')}
              </Button>
            </Grid>
          )}
        </Grid>
      )}
      {!editMode && (
        <Grid container style={{ padding: '0 120px 20px 120px' }}>
          <Grid item md={12} style={{ marginTop: '20px' }}>
            <Divider />
          </Grid>
          <Grid item md={6} style={{ textAlign: 'left' }}>
            <Button
              variant="outlined"
              type="submit"
              color="primary"
              aria-label="form_draft"
              style={{ margin: '25px 25px 0 0' }}
              onClick={() => formSubmit(formData, 'draft')}
              disabled={formState.isSubmitting}
              data-testid="save_as_draft"
            >
              {t('common:form_actions.save_as_draft')}
            </Button>
          </Grid>
          <Grid item md={6} style={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              aria-label="form_submit"
              style={{ marginTop: '25px' }}
              onClick={() => formSubmit(formData)}
              disabled={formState.isSubmitting}
              data-testid="submit_form_btn"
            >
              {!formState.isSubmitting
                ? t('common:form_actions.submit')
                : t('common:form_actions.submitting')}
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}

Form.propTypes = {
  editMode: PropTypes.bool.isRequired,
  formId: PropTypes.string.isRequired
};
