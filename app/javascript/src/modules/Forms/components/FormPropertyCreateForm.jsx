import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormPropertyCreateMutation, FormPropertyUpdateMutation } from '../graphql/forms_mutation';
import CenteredContent from '../../../components/CenteredContent';
import FormPropertySelector from './FormPropertySelector';
import FormOptionInput from './FormOptionInput';
import SwitchInput from './SwitchInput';
import { FormPropertyQuery } from '../graphql/forms_queries';
import { Spinner } from '../../../shared/Loading';
import { formatError } from '../../../utils/helpers';
import MessageAlert from '../../../components/MessageAlert';

const initData = {
  fieldName: '',
  fieldType: '',
  required: false,
  adminUse: false,
  order: '1',
  fieldValue: []
};

const fieldTypes = {
  text: 'Text',
  radio: 'Radio',
  file_upload: 'File Upload',
  signature: 'Signature',
  date: 'Date',
  dropdown: 'Dropdown'
};

export default function FormPropertyCreateForm({ formId, refetch, propertyId, close }) {
  const [propertyData, setProperty] = useState(initData);
  const [isLoading, setMutationLoading] = useState(false);
  const [options, setOptions] = useState(['']);
  const { t } = useTranslation('form');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [formPropertyCreate] = useMutation(FormPropertyCreateMutation);
  const [formPropertyUpdate] = useMutation(FormPropertyUpdateMutation);
  const history = useHistory();
  const [loadFields, { data }] = useLazyQuery(FormPropertyQuery, {
    variables: { formId, formPropertyId: propertyId }
  });

  useEffect(() => {
    if (propertyId) {
      loadFields();
    }
    if (data) {
      setProperty({ ...propertyData, ...data.formProperty });
      const values = data.formProperty.fieldValue.map(val => val.value);
      setOptions(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, data]);

  function handlePropertyValueChange(event) {
    const { name, value } = event.target;
    setProperty({
      ...propertyData,
      [name]: value
    });
  }

  function handleRadioChange(event) {
    const { name, checked } = event.target;
    setProperty({
      ...propertyData,
      [name]: checked
    });
  }

  const nextOrder = Number(propertyData.order) + 1;
  const fieldValue = options.map(option => ({ value: option, label: option }));

  function saveFormProperty(event) {
    event.preventDefault();
    setMutationLoading(true);
    formPropertyCreate({
      variables: {
        ...propertyData,
        fieldValue,
        formId
      }
    })
      .then(() => {
        refetch();
        setMutationLoading(false);
        setMessage({ ...message, isError: false, detail: t('misc.created_form_property') });
        setProperty({
          ...initData,
          order: nextOrder.toString()
        });
        setOptions(['']);
      })
      .catch(err => {
        setMessage({ ...message, isError: true, detail: formatError(err.message) });
        setMutationLoading(false);
      });
  }

  function updateFormProperty(event) {
    event.preventDefault();
    setMutationLoading(true);
    formPropertyUpdate({
      variables: {
        ...propertyData,
        fieldValue,
        id: propertyId
      }
    })
      .then(res => {
        const formPropResponse = res.data.formPropertiesUpdate
        if (formPropResponse.message === 'New version created') {
          history.push(`/edit_form/${formPropResponse.newFormVersion.id}`)
        }
        refetch();
        setMutationLoading(false);
        setProperty({
          ...initData,
          order: nextOrder.toString()
        });
        setOptions(['']);
        setMessage({ ...message, isError: false, detail: t('misc.updated_form_property') });
        close();
      })
      .catch(err => {
        setMessage({ ...message, isError: true, detail: formatError(err.message) });
        setMutationLoading(false);
      });
  }

  return (
    <>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />

      <form
        onSubmit={propertyId ? updateFormProperty : saveFormProperty}
        data-testid="form_property_submit"
      >
        <TextField
          id="standard-basic"
          label={t('form_fields.field_name')}
          variant="outlined"
          value={propertyData.fieldName}
          onChange={handlePropertyValueChange}
          name="fieldName"
          style={{ width: '100%' }}
          inputProps={{ 'data-testid': 'field_name' }}
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
          <Button
            variant="outlined"
            type="submit"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading && <Spinner />}
          >
            {!propertyId ? t('actions.add_form_property') : t('actions.update_property')}
          </Button>
        </CenteredContent>
      </form>
    </>
  );
}

FormPropertyCreateForm.defaultProps = {
  propertyId: null,
  close: () => {}
};

FormPropertyCreateForm.propTypes = {
  refetch: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  close: PropTypes.func,
  propertyId: PropTypes.string
};
