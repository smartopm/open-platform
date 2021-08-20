import React, { useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import { useHistory, useParams } from 'react-router';
import SwitchInput from '../FormProperties/SwitchInput';
import CenteredContent from '../../../../components/CenteredContent';
import {
  FormCategoryCreateMutation,
  FormCategoryUpdateMutation
} from '../../graphql/form_category_mutations';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';

export default function CategoryForm({ data, close, formData, refetchCategories }) {
  const { t } = useTranslation('form');
  const [categoryData, setCategoryData] = useState(data);
  const [info, setInfo] = useState({ error: false, message: '' });
  const [createCategory, { loading, called }] = useMutation(FormCategoryCreateMutation);
  const [updateCategory, { loading: updateLoading, called: updateCalled }] = useMutation(
    FormCategoryUpdateMutation
  );
  const { formId } = useParams();
  const history = useHistory();

  function handleSaveCategory(event) {
    event.preventDefault();
    createCategory({ variables: { ...categoryData, order: Number(categoryData.order), formId } })
      .then(() => {
        refetchCategories();
        close();
        setInfo({ error: false, message: t('misc.created_form_category') });
      })
      .catch(err => {
        setInfo({ ...info, error: formatError(err.message) });
      });
  }

  function handleUpdateCategory(event) {
    event.preventDefault();
    updateCategory({
      variables: { ...categoryData, order: Number(categoryData.order), categoryId: data.id }
    })
      .then(res => {
        const categoryResponse = res.data.categoryUpdate;
        if (categoryResponse.message === 'New version created') {
          history.push(`/edit_form/${categoryResponse.newFormVersion.id}`);
        }
        setInfo({ error: false, message: t('misc.updated_form_category') });
        refetchCategories();
        close();
      })
      .catch(err => {
        setInfo({ error: true, message: formatError(err.message) });
      });
  }

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

  console.log(formData)

  return (
    <>
      <MessageAlert
        type={info.error ? 'error' : 'success'}
        message={info.message}
        open={(called || updateCalled) && !loading}
        handleClose={() => {}}
      />
      <form
        onSubmit={data.id ? handleUpdateCategory : handleSaveCategory}
        data-testid="form_property_submit"
      >
        <TextField
          id="cat-name"
          label={t('form_fields.name')}
          variant="outlined"
          value={categoryData.fieldName}
          onChange={handleChange}
          name="fieldName"
          style={{ width: '100%' }}
          inputProps={{ 'data-testid': 'name' }}
          margin="dense"
          autoFocus={process.env.NODE_ENV !== 'test'}
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
        <Grid container spacing={3}>
          <Grid item xs>
            {/* This should be a dropdown */}
            <TextField
              id="cat-property_field_name"
              label={t('form_fields.property_field_name')}
              variant="outlined"
              value={categoryData.propertyFieldName}
              onChange={handleChange}
              name="displayCondition"
              inputProps={{ 'data-testid': 'property_field_name' }}
              margin="dense"
              required
            />
          </Grid>
          {/* This too should be a dropdown */}
          <Grid item xs>
            <TextField
              id="cat-condition"
              label={t('form_fields.condition')}
              variant="outlined"
              value={categoryData.condition}
              onChange={handleChange}
              name="displayCondition"
              inputProps={{ 'data-testid': 'condition' }}
              margin="dense"
              required
            />
          </Grid>
          <Grid item xs>
            <TextField
              id="cat-condition_value"
              label={t('form_fields.condition_value')}
              variant="outlined"
              value={categoryData.conditionValue}
              onChange={handleChange}
              name="displayCondition"
              inputProps={{ 'data-testid': 'condition_value' }}
              margin="dense"
              required
            />
          </Grid>
        </Grid>
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
          rows={6}
          multiline
        />

        <div style={{ marginTop: 20 }}>
          <SwitchInput
            name="headerVisible"
            label={t('form_fields.header_visible')}
            value={categoryData.headerVisible || false}
            handleChange={handleRadioChange}
          />
          <SwitchInput
            name="general"
            label={t('form_fields.general_category')}
            value={categoryData.general || false}
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
            inputProps={{ 'data-testid': 'order_number' }}
          />
        </div>
        <br />
        <CenteredContent>
          <Button
            variant="outlined"
            type="submit"
            color="primary"
            data-testid="category_action_btn"
            disabled={loading || updateLoading}
            startIcon={(loading || updateLoading) && <Spinner />}
          >
            {data.id ? t('actions.update_category') : t('actions.create_category')}
          </Button>
        </CenteredContent>
      </form>
    </>
  );
}

CategoryForm.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    fieldName: PropTypes.string,
    displayCondition: PropTypes.string,
    order: PropTypes.number,
    description: PropTypes.string,
    headerVisible: PropTypes.bool,
    renderedText: PropTypes.string,
    general: PropTypes.bool
  }).isRequired,
  close: PropTypes.func.isRequired,
  refetchCategories: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  formData: PropTypes.object.isRequired,
};
