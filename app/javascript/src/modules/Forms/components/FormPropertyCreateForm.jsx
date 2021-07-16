import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { FormPropertyCreateMutation } from '../graphql/forms_mutation';
import CenteredContent from '../../../components/CenteredContent';
import FormPropertySelector from './FormPropertySelector';
import FormOptionInput from './FormOptionInput';
import SwitchInput from './SwitchInput';

const initData = {
  fieldName: '',
  fieldType: '',
  required: false,
  adminUse: false,
  order: '1',
  fieldValue: [],
};

const fieldTypes = {
  text: 'Text',
  radio: 'Radio',
  file_upload: 'File Upload',
  signature: 'Signature',
  date: 'Date',
  dropdown: 'Dropdown',
};

export default function FormPropertyCreateForm({ formId, refetch }) {
  const [propertyData, setProperty] = useState(initData);
  const [isLoading, setMutationLoading] = useState(false);
  const [options, setOptions] = useState(['']);
  const { t } = useTranslation('form');
  const [formPropertyCreate] = useMutation(FormPropertyCreateMutation);

  function handlePropertyValueChange(event) {
    const { name, value } = event.target;
    setProperty({
      ...propertyData,
      [name]: value,
    });
  }

  function handleRadioChange(event) {
    const { name, checked } = event.target;
    setProperty({
      ...propertyData,
      [name]: checked,
    });
  }

  function saveFormProperty(event) {
    event.preventDefault();
    const nextOrder = Number(propertyData.order) + 1;
    const fieldValue = options.map((option) => ({ value: option, label: option }));
    setMutationLoading(true);
    formPropertyCreate({
      variables: {
        ...propertyData,
        fieldValue,
        formId,
      },
    })
      .then(() => {
        refetch();
        setMutationLoading(false);
        setProperty({
          ...initData,
          order: nextOrder.toString(),
        });
        setOptions(['']);
      })
      .catch(() => {
        setMutationLoading(false);
      });
  }

  return (
    <form onSubmit={saveFormProperty}>
      <TextField
        id="standard-basic"
        label={t('form_fields.field_name')}
        variant="outlined"
        value={propertyData.fieldName}
        onChange={handlePropertyValueChange}
        name="fieldName"
        style={{ width: '100%' }}
        margin="normal"
        autoFocus
        required
      />
      <FormPropertySelector
        label={t('form_fields.field_type')}
        name="fieldType"
        value={propertyData.fieldType}
        handleChange={handlePropertyValueChange}
        options={fieldTypes}
      />
      {(propertyData.fieldType === 'radio' || propertyData.fieldType === 'dropdown') && (
        <FormOptionInput label="Option" options={options} setOptions={setOptions} />
      )}
      <div style={{ marginTop: 20 }}>
        <SwitchInput
          name="required"
          label={t('form_fields.required_field')}
          value={propertyData.required}
          handleChange={handleRadioChange}
        />
        <SwitchInput
          name="adminUse"
          label={t('form_fields.admins_only')}
          value={propertyData.adminUse}
          handleChange={handleRadioChange}
        />
        <TextField
          label={t('form_fields.order_number')}
          id="outlined-size-small"
          value={propertyData.order}
          onChange={handlePropertyValueChange}
          variant="outlined"
          size="small"
          name="order"
          style={{ marginLeft: 20 }}
        />
      </div>
      <br />
      <CenteredContent>
        <Button variant="outlined" type="submit" disabled={isLoading} color="primary">
          {isLoading ? t('actions.adding_form_property') : t('actions.add_form_property')}
        </Button>
      </CenteredContent>
    </form>
  );
}

FormPropertyCreateForm.propTypes = {
  refetch: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
};
