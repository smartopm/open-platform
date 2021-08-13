import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import { useParams } from 'react-router';
import SwitchInput from '../SwitchInput';
import CenteredContent from '../../../../components/CenteredContent';
import { FormCategoryCreateMutation } from '../../graphql/form_category_mutations';
import { Spinner } from '../../../../shared/Loading';
import MessageAlert from '../../../../components/MessageAlert';

export default function CategoryForm({ data, close }) {
  const initialData = {
    fieldName: '',
    order: 1,
    description: '',
    headerVisible: false,
    renderedText: '',
    general: false
  };
  const { t } = useTranslation('form');
  const [categoryData, setCategoryData] = useState(initialData);
  const [createCategory, { loading, error, called }] = useMutation(FormCategoryCreateMutation);
  const { formId } = useParams();

  function handleSaveCategory(event) {
    event.preventDefault();
    createCategory({ variables: { ...categoryData, order: Number(categoryData.order), formId } })
      .then(() => close())
    //   .catch();
  }

  console.log(loading, error);
  console.log(data);
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
    <>
      <MessageAlert
        type={error ? 'error' : 'success'}
        message={error?.message || 'Successfully created a category'}
        open={called && !loading}
        handleClose={() => {}}
      />
      <form onSubmit={handleSaveCategory} data-testid="form_property_submit">
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
            name="headerVisible"
            label={t('form:form_fields.header_visible')}
            value={categoryData.headerVisible}
            handleChange={handleRadioChange}
          />
          <SwitchInput
            name="general"
            label={t('form:form_fields.general_category')}
            value={categoryData.general}
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
            disabled={loading}
            startIcon={loading && <Spinner />}
          >
            Save Category
          </Button>
        </CenteredContent>
      </form>
    </>
  );
}

CategoryForm.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    order: PropTypes.number,
    description: PropTypes.string,
    headerVisible: PropTypes.bool,
    renderedText: PropTypes.string
  }).isRequired,
  close: PropTypes.func.isRequired
};
