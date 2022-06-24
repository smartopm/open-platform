import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import { FormPropertyCreateMutation, FormPropertyUpdateMutation } from '../graphql/forms_mutation';
import FormPropertySelector from './FormPropertySelector';
import FormOptionInput from './FormOptionInput';
import SwitchInput from './FormProperties/SwitchInput';
import { FormPropertyQuery } from '../graphql/forms_queries';
import { Spinner } from '../../../shared/Loading';
import { formatError } from '../../../utils/helpers';
import MessageAlert from '../../../components/MessageAlert';
import { LiteFormCategories } from '../graphql/form_category_queries';

// Replace this with translation and remove options on FormPropertySelector
const fieldTypes = {
  checkbox: 'Checkbox',
  date: 'Date',
  datetime: 'Date with Time',
  dropdown: 'Dropdown',
  file_upload: 'File Upload',
  radio: 'Radio',
  signature: 'Signature',
  text: 'Text',
  time: 'Time',
  payment: 'Payment'
};

export default function FormPropertyCreateForm({
  formId,
  refetch,
  propertyId,
  categoryId,
  close,
  formDetailRefetch
}) {
  const initData = {
    fieldName: '',
    fieldType: '',
    required: false,
    adminUse: false,
    order: '1',
    fieldValue: [],
    categoryId,
    shortDesc: '',
    longDesc: ''
  };
  const [propertyData, setProperty] = useState(initData);
  const [isLoading, setMutationLoading] = useState(false);
  const classes = useStyles();
  const [options, setOptions] = useState(['']);
  const { t } = useTranslation('form');
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [formPropertyCreate] = useMutation(FormPropertyCreateMutation);
  const [formPropertyUpdate] = useMutation(FormPropertyUpdateMutation);
  const history = useHistory();
  const matches = useMediaQuery('(max-width:900px)');
  const [loadFields, { data }] = useLazyQuery(FormPropertyQuery, {
    variables: { formId, formPropertyId: propertyId }
  });
  const categoriesData = useQuery(LiteFormCategories, {
    variables: { formId }
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
        shortDesc: String(propertyData.shortDesc),
        fieldValue,
        formId
      }
    })
      .then(() => {
        refetch();
        formDetailRefetch();
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
        formPropertyId: propertyId,
        shortDesc: String(propertyData.shortDesc)
      }
    })
      .then(res => {
        const formPropResponse = res.data.formPropertiesUpdate;
        if (formPropResponse.message === 'New version created') {
          history.push(`/edit_form/${formPropResponse.newFormVersion.id}`);
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
        className={classes.container}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item md={12} xs={12}>
            <TextField
              id="standard-basic"
              label={t('form_fields.field_name')}
              variant="outlined"
              value={propertyData.fieldName}
              onChange={handlePropertyValueChange}
              name="fieldName"
              style={{ width: '100%' }}
              className="form-property-field-name-txt-input"
              inputProps={{ 'data-testid': 'field_name' }}
              margin="normal"
              autoFocus={process.env.NODE_ENV !== 'test'}
              required
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <FormPropertySelector
              label={t('form_fields.field_type')}
              name="fieldType"
              value={propertyData.fieldType}
              handleChange={evt => setProperty({ ...propertyData, fieldType: evt.target.value })}
              options={fieldTypes}
            />
          </Grid>
          <Grid item md={6} xs={12} style={{ marginTop: '-8px' }}>
            <FormControl variant="outlined" style={{ width: '100%' }} margin="normal">
              <InputLabel>{t('misc.category')}</InputLabel>
              <Select
                labelId="select-category"
                id="category"
                value={propertyData.categoryId}
                onChange={handlePropertyValueChange}
                label={t('misc.choose_category')}
                name="categoryId"
                required
              >
                {categoriesData?.data?.formCategories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.fieldName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {propertyData.fieldType === 'payment' && (
            <Grid item md={12} xs={12}>
              <TextField
                id="standard-short_desc"
                label={t('form_fields.amount_to_pay')}
                variant="outlined"
                value={propertyData.shortDesc}
                onChange={handlePropertyValueChange}
                name="shortDesc"
                type="number"
                style={{ width: '100%' }}
                className="form-property-field-name-txt-input"
                inputProps={{ 'data-testid': 'short_desc' }}
                margin="normal"
              />
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <TextField
              id="standard-short_desc"
              label={t('form_fields.description')}
              variant="outlined"
              value={propertyData.longDesc}
              onChange={handlePropertyValueChange}
              name="longDesc"
              style={{ width: '100%' }}
              className="form-property-field-name-txt-input"
              inputProps={{ 'data-testid': 'long_desc' }}
              margin="normal"
              multiline
            />
          </Grid>
          <Grid item md={12} xs={12}>
            {(propertyData.fieldType === 'radio' ||
              propertyData.fieldType === 'dropdown' ||
              propertyData.fieldType === 'checkbox') && (
              <FormOptionInput label="Option" options={options} setOptions={setOptions} />
            )}
          </Grid>
          <Grid item md={4} xs={6}>
            <SwitchInput
              name="required"
              label={<Typography variant="caption">{t('form_fields.required_field')}</Typography>}
              value={propertyData.required}
              handleChange={handleRadioChange}
              className="form-property-required-field-switch-btn"
              labelPlacement="end"
            />
          </Grid>
          <Grid item md={4} xs={6}>
            <SwitchInput
              name="adminUse"
              label={<Typography variant="caption">{t('form_fields.admins_only')}</Typography>}
              value={propertyData.adminUse}
              handleChange={handleRadioChange}
              labelPlacement="end"
            />
          </Grid>
          <Grid item md={4} xs={12}>
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
          </Grid>
          <Grid item md={12} xs={12} style={matches ? { textAlign: 'center' } : {}}>
            <Button
              variant="outlined"
              type="submit"
              color="primary"
              data-testid="form_property_action_btn"
              disabled={isLoading}
              startIcon={isLoading && <Spinner />}
            >
              {!propertyId ? t('actions.add_form_property') : t('actions.update_property')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

FormPropertyCreateForm.defaultProps = {
  propertyId: null,
  close: () => {},
  formDetailRefetch: () => {}
};

FormPropertyCreateForm.propTypes = {
  refetch: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  propertyId: PropTypes.string,
  close: PropTypes.func,
  formDetailRefetch: PropTypes.func
};

const useStyles = makeStyles(() => ({
  container: {
    background: '#F5F5F4',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px'
  }
}));
