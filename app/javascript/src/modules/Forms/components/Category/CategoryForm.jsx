import React, { useState, useEffect } from 'react';
import { Button, Grid, Hidden, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import { useHistory, useParams } from 'react-router';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
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
  const initialData = {
    fieldName: '',
    description: '',
    headerVisible: false,
    general: false,
    order: 1,
    renderedText: ' ',
    condition: '',
    groupingId: '',
    value: '' // value for the condition
  };
  
  const { t } = useTranslation('form');
  const [categoryData, setCategoryData] = useState(initialData);
  const [info, setInfo] = useState({ error: false, message: '' });
  const [createCategory, { loading, called }] = useMutation(FormCategoryCreateMutation);
  const [updateCategory, { loading: updateLoading, called: updateCalled }] = useMutation(
    FormCategoryUpdateMutation
  );
  const { formId } = useParams();
  const history = useHistory();
  const classes = useStyles()

  useEffect(() => {
    if (data.id) {
      setCategoryData({
        ...data,
        condition: data.displayCondition?.condition || '',
        groupingId: data.displayCondition?.groupingId || '',
        value: data.displayCondition?.value || ''
      });
    }
  }, [data]);

  function handleSaveCategory(event) {
    event.preventDefault();
    const { condition, groupingId, value, ...catData } = categoryData
    createCategory({ 
      variables: { 
        ...catData, 
        displayCondition: {
          condition,
          groupingId,
          value
        },
        order: Number(categoryData.order), 
        formId 
      } })
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
    const { condition, groupingId, value, ...catData } = categoryData
    updateCategory({
      variables: { 
        ...catData,
        displayCondition: {
          condition,
          groupingId,
          value
        },
        order: Number(categoryData.order), 
        categoryId: data.id 
      }
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

  function clearDisplayCondition() {
    setCategoryData({
      ...categoryData,
        condition: '',
        groupingId: '',
        value: ''
    });
  }

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
          className="form-category-name-txt-input"
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
          className="form-category-description-txt-input"
          inputProps={{ 'data-testid': 'description' }}
          margin="dense"
          required
        />
        <Typography gutterBottom variant="caption">
          {t('misc.display_condition')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              id="property_field_name"
              value={categoryData.groupingId}
              onChange={handleChange}
              label={t('form_fields.property_field_name')}
              style={{ width: '100%' }}
              variant="outlined"
              margin="dense"
              name="groupingId"
              select
            >
              {formData.map(property => (
                <MenuItem key={property.id} value={property.id}>
                  {property.fieldName}
                </MenuItem>
            ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="cat-condition"
              value={categoryData.condition}
              onChange={handleChange}
              label={t('form_fields.condition')}
              name="condition"
              inputProps={{ 'data-testid': 'condition' }}
              style={{ width: '100%' }}
              variant="outlined"
              margin="dense"
              select
            >
              {Object.entries(t('conditions', { returnObjects: true })).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
            ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              id="cat-condition_value"
              label={t('form_fields.condition_value')}
              variant="outlined"
              value={categoryData.value}
              onChange={handleChange}
              name="value"
              inputProps={{ 'data-testid': 'condition_value' }}
              style={{ width: '100%' }}
              margin="dense"
            />
          </Grid>
          <Grid item sm={1} xs={6} data-testid="clear_condition">
            <Hidden smDown>
              <IconButton
                onClick={clearDisplayCondition}
                className={classes.clearIcon}
                size="large"
              >
                <DeleteOutline color="primary" />
              </IconButton>
            </Hidden>
            <Hidden only={['sm', 'lg', 'md', 'xl']}>
              <Button color="primary" onClick={clearDisplayCondition} className={classes.clearTex}>
                {t('actions.clear_condition')}
              </Button>
            </Hidden>
          </Grid>
        </Grid>
        <TextField
          id="cat-rendered_text"
          label={t('form_fields.rendered_text')}
          variant="outlined"
          value={categoryData.renderedText || ''}
          onChange={handleChange}
          name="renderedText"
          style={{ width: '100%' }}
          className="form-category-rendered-txt-input"
          inputProps={{ 'data-testid': 'rendered_text' }}
          helperText={t('form_fields.rendered_text_helper')}
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
            className="form-category-header-visible-switch-btn"
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
const useStyles = makeStyles({
  // keeping pixels for height measurements
  clearIcon: {
    marginTop: 4
  },
  clearTex: {
    marginTop: -17
  },
})

CategoryForm.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    fieldName: PropTypes.string,
    displayCondition: PropTypes.shape({
      condition: PropTypes.string,
      groupingId: PropTypes.string,
      value: PropTypes.string,
    }),
    order: PropTypes.number,
    description: PropTypes.string,
    headerVisible: PropTypes.bool,
    renderedText: PropTypes.string,
    general: PropTypes.bool
  }).isRequired,
  close: PropTypes.func.isRequired,
  refetchCategories: PropTypes.func.isRequired,
  formData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fieldName: PropTypes.string
    })
  ).isRequired
};
