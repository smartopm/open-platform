/* eslint-disable max-statements */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useState, useContext, useEffect } from 'react';
import { Button, DialogContent, DialogContentText, Grid, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DetailsDialog } from '../../../../components/Dialog';
import CategoryForm from './CategoryForm';
import { FormCategoriesQuery } from '../../graphql/form_category_queries';
import { Spinner } from '../../../../shared/Loading';
import { FormContext } from '../../Context';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { flattenFormProperties, getValueFromProperty } from '../../utils';
import CategoryList from './CategoryList';
import FormPreview from '../FormPreview';
import MessageAlert from '../../../../components/MessageAlert';
import { FormCategoryDeleteMutation } from '../../graphql/form_category_mutations';
import { formatError, useParamsQuery } from '../../../../utils/helpers';
import FormTitle from '../FormTitle';
import AccessCheck from '../../../Permissions/Components/AccessCheck';
import TermsAndCondition from '../TermsAndCondition';
import flutterwaveConfig, { closeFlutterwaveModal } from '../../../Payments/TransactionLogs/utils';
import { TransactionLogCreateMutation } from '../../../Payments/TransactionLogs/graphql/transaction_logs_mutation';
import ListWrapper from '../../../../shared/ListWrapper';
import CalendlyEmbed from '../FormProperties/CalendlyEmbed';

export default function Form({
  editMode,
  formId,
  property,
  isPublishing,
  handleConfirmPublish,
  formDetailData,
  formDetailRefetch,
  loading,
}) {
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [propertyFormOpen, setPropertyFormOpen] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false)
  const [submittingPayment, setSubmittingPayment] = useState(false)
  const [data, setFormData] = useState({});
  const { t } = useTranslation(['common', 'form', 'payment']);
  const [categoryId, setCategoryId] = useState('');
  const matches = useMediaQuery('(max-width:900px)');
  const categoriesData = useQuery(FormCategoriesQuery, {
    variables: { formId },
    fetchPolicy: 'no-cache',
  });

  const {
    formState,
    saveFormData,
    setFormState,
    imgUploadError,
    uploadedImages,
    filesToUpload,
    setImgUploadError,
    formProperties
  } = useContext(FormContext);
  const authState = useContext(Context);

  const history = useHistory();
  const [categoryDelete, { loading: isDeleting, error }] = useMutation(FormCategoryDeleteMutation);
  const [createTransactionLog] = useMutation(TransactionLogCreateMutation);
  const path = useParamsQuery('');
  const userId = path.get('userId');
  const formData = flattenFormProperties(categoriesData.data?.formCategories);
  // check if this submission includes a payment type
  const hasPayment = formData.some(field => field.fieldType === 'payment');
  const hasAppointment = formData.some(field => field.fieldType === 'appointment');
  const appointmentValue = getValueFromProperty(formData, 'appointment')

  useEffect(() => {
    if (formState?.successfulSubmit && !formState?.isDraft) {
      // TODO: Enable form redirect on form creation
      setTimeout(() => {
        history.push('/');
      }, 3000);
    }
  }, [formState.isDraft, formState.successfulSubmit, hasAppointment]);

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
      variables: { categoryId: category, formId },
    }).then(res => {
      const formPropResponse = res.data.categoryDelete;
      if (formPropResponse.message === 'New version created') {
        history.push(`/edit_form/${formPropResponse.newFormVersion.id}`);
      }
      categoriesData.refetch();
      formDetailRefetch();
    });
  }

  function handleAddField(catId) {
    setCategoryId(catId);
    setPropertyFormOpen(!propertyFormOpen);
  }

  function handleCategoryClose() {
    setCategoryFormOpen(false);
  }

  function handleMessageAlertClose(uploadError) {
    if (uploadError) {
      setImgUploadError(false);
      return;
    }
    setFormState({ ...formState, error: false, previewable: false, alertOpen: false });
  }

  function handleCancelPreview() {
    setFormState({ ...formState, previewable: false });
  }

  async function saveTransactionLog(response, value) {
    return createTransactionLog({
      variables: {
        paidAmount: response.amount,
        amount: parseFloat(value.amount),
        currency: response.currency,
        invoiceNumber: '-',
        transactionId: `${response.transaction_id}`,
        transactionRef: `${response.tx_ref}`,
        description: value.description,
        accountName: authState.user.name,
      },
    });
  }

  function formSubmit(propertiesData, status, isPreview=false, scheduled=false) {
    if (filesToUpload.length !== uploadedImages.length) {
      setImgUploadError(true);
      return;
    }

    if (formDetailData?.form?.preview && !isPreview) {
      setFormState({ ...formState, previewable: formDetailData.form?.preview });
      return;
    }
    const paymentValue = getValueFromProperty(propertiesData, 'payment')
    const { config } = flutterwaveConfig(authState, paymentValue, t);
    if(hasAppointment && !scheduled) {
      window.FormPropertyData = formData
      window.FilledInProperties = formProperties
      window.FormCategories = categoriesData.data?.formCategories
      setShowCalendly(true)
     return
    }

    if (hasPayment) {
      setSubmittingPayment(true);
      window.FlutterwaveCheckout({
        ...config,
        callback: response =>  {
          saveTransactionLog(response, paymentValue)
            .then(() => {
              saveFormData(
                propertiesData,
                formId,
                userId || authState.user.id,
                categoriesData.data?.formCategories,
                status,
                hasAgreedToTerms
              );
            setSubmittingPayment(false);
            })
            .catch(err => {
              setFormState({
                ...formState,
                error: true,
                info: formatError(err),
                alertOpen: true,
                isSubmitting: false,
              });
            setSubmittingPayment(false);
            })
            .finally(() => closeFlutterwaveModal())
        },
        // If the modal was closed before proceeding with the payment,
        // then we should allow to resubmit the payment
        onclose: (inComplete) => {
          setSubmittingPayment(!inComplete);
          setFormState({
            ...formState,
            error: inComplete,
            info: inComplete && t('common:errors.something_went_wrong_payment'),
            alertOpen: inComplete,
            isSubmitting: false,
          });
        },
      });
    } else {
      saveFormData(
        propertiesData,
        formId,
        userId || authState.user.id,
        categoriesData.data?.formCategories,
        status,
        hasAgreedToTerms
      );
    }
  }

  const isTermsChecked = formDetailData?.form?.hasTermsAndConditions ? !hasAgreedToTerms : false;

  return (
    <>
      <MessageAlert
        type={formState.error || error || imgUploadError ? 'error' : 'success'}
        message={
          formState.info ||
          formatError(error?.message) || (
            <div>
              <Typography variant="body1">{t('form:misc.upload_error')}</Typography>
              {' '}
              <Typography variant="body2">{t('form:misc.upload_error_content_one')}</Typography>
              <Typography variant="body2">{t('form:misc.upload_error_content_two')}</Typography>
              <Typography variant="body2">{t('form:misc.upload_error_content_three')}</Typography>
              <Typography variant="body2">{t('form:misc.upload_error_content_four')}</Typography>
            </div>
          )
        }
        open={formState.alertOpen || !!error || imgUploadError}
        handleClose={() => handleMessageAlertClose(imgUploadError)}
      />

      <CalendlyEmbed
        isOpen={showCalendly}
        submitForm={() => formSubmit(formData, null, false, true)}
        appointmentValue={appointmentValue}
      />

      {categoryFormOpen && (
        <CategoryForm
          data={data}
          close={handleCategoryClose}
          formData={formData}
          refetchCategories={categoriesData.refetch}
          formDetailRefetch={formDetailRefetch}
          categoryFormOpen={categoryFormOpen}
          handleCategoryClose={handleCategoryClose}
        />
      )}

      <DetailsDialog
        handleClose={handleCancelPreview}
        open={formState.previewable && !imgUploadError && !formState.error}
        title={t('form:misc.contract_preview')}
        color="primary"
        scroll="paper"
      >
        <DialogContent dividers>
          <DialogContentText component="div">
            <FormPreview
              loading={formState.isSubmitting || submittingPayment}
              handleFormSubmit={() => formSubmit(formData, null, true)}
              categoriesData={categoriesData.data?.formCategories}
            />
          </DialogContentText>
        </DialogContent>
      </DetailsDialog>
      {(loading || categoriesData.loading) && <Spinner />}
      {!editMode && !loading && formDetailData && (
        <Grid style={matches ? {} : { padding: '0 0 0 100px' }}>
          <FormTitle name={formDetailData.form?.name} />
        </Grid>
      )}
      <div
        data-testid="category-list-container"
        style={formState.isSubmitting ? { opacity: '0.3', pointerEvents: 'none' } : {}}
        id="calendly"
      >
        <CategoryList
          categoriesData={categoriesData}
          editMode={editMode}
          formId={formId}
          propertyFormOpen={propertyFormOpen}
          categoryId={categoryId}
          categoryItem={{ handleAddField, handleEditCategory, handleDeleteCategory }}
          loading={isDeleting}
          formDetailRefetch={formDetailRefetch}
        />
      </div>
      <br />
      {editMode && (
        <Grid container spacing={4}>
          {property && (
            <Grid
              item
              md={12}
              xs={12}
              style={matches ? { marginTop: '10px' } : { marginTop: '20px' }}
            >
              <Divider />
            </Grid>
          )}
          <Grid
            item
            md={!property ? 12 : 6}
            xs={12}
            style={
              !property
                ? { textAlign: 'right' }
                : matches
                ? { textAlign: 'center' }
                : { textAlign: 'left' }
            }
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
            <Grid
              item
              md={6}
              xs={12}
              style={matches ? { textAlign: 'center' } : { textAlign: 'right' }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmPublish}
                disabled={isPublishing}
                startIcon={isPublishing && <Spinner />}
                style={{ color: 'white' }}
                data-testid="publishing"
              >
                {isPublishing ? t('form:misc.publishing_form') : t('form:actions.publish_form')}
              </Button>
            </Grid>
          )}
        </Grid>
      )}

      {!editMode && (
        <Grid container style={matches ? {} : { padding: '0 120px 20px 120px' }}>
          {formDetailData?.form?.hasTermsAndConditions && (
            <Grid item md={12} xs={12} style={{ marginTop: '20px' }}>
              <TermsAndCondition
                categoriesData={categoriesData.data?.formCategories}
                isChecked={hasAgreedToTerms}
                handleCheckTerms={isChecked => setHasAgreedToTerms(isChecked)}
              />
            </Grid>
          )}

          {hasPayment && (
            <ListWrapper>
              <Typography variant="caption">{t('form:misc.flutterwave_notice')}</Typography>
              <br />
            </ListWrapper>
          )}
          <Grid item md={12} xs={12} style={{ marginTop: '20px' }}>
            <Divider />
          </Grid>
          <AccessCheck
            module="forms"
            allowedPermissions={['can_save_draft_form']}
            show404ForUnauthorized={false}
          >
            <Grid item md={6} xs={6} style={{ textAlign: 'left' }}>
              <Button
                variant="outlined"
                type="submit"
                color="primary"
                aria-label="form_draft"
                style={matches ? { marginTop: '20px' } : { margin: '25px 25px 0 0' }}
                onClick={() => formSubmit(formData, 'draft')}
                disabled={formState.isSubmitting || submittingPayment}
                data-testid="save_as_draft"
              >
                {t('common:form_actions.save_as_draft')}
              </Button>
            </Grid>
          </AccessCheck>
          {(formDetailData?.form?.roles.includes(authState?.user?.userType?.toLowerCase()) ||
            authState?.user?.userType === 'admin') && (
            <Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                aria-label="form_submit"
                style={matches ? { marginTop: '20px' } : { marginTop: '25px' }}
                onClick={() => formSubmit(formData, null)}
                disabled={formState.isSubmitting || submittingPayment || isTermsChecked}
                startIcon={(formState.isSubmitting || submittingPayment) && <Spinner />}
                data-testid="submit_form_btn"
              >
                {hasPayment ? t('common:misc.make_a_payment') : t('common:form_actions.submit')}
              </Button>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}

Form.defaultProps = {
  property: null,
  isPublishing: false,
  handleConfirmPublish: () => {},
  formDetailRefetch: () => {},
  loading: false,
  formDetailData: null,
};

Form.propTypes = {
  editMode: PropTypes.bool.isRequired,
  formId: PropTypes.string.isRequired,
  property: PropTypes.bool,
  isPublishing: PropTypes.bool,
  handleConfirmPublish: PropTypes.func,
  formDetailData: PropTypes.shape({
    form: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      preview: PropTypes.bool,
      isPublic: PropTypes.bool,
      hasTermsAndConditions: PropTypes.bool,
      roles: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  formDetailRefetch: PropTypes.func,
  loading: PropTypes.bool,
};
