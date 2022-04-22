/* eslint-disable max-lines */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Divider
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useHistory, useParams } from 'react-router';
import CancelIcon from '@mui/icons-material/Cancel';
import SwitchInput from '../FormProperties/SwitchInput';
import {
  FormCategoryCreateMutation,
  FormCategoryUpdateMutation
} from '../../graphql/form_category_mutations';
import MessageAlert from '../../../../components/MessageAlert';
import { formatError } from '../../../../utils/helpers';
import { CustomizedDialogs } from '../../../../components/Dialog';

export default function CategoryForm({
  data,
  close,
  formData,
  refetchCategories,
  handleCategoryClose,
  categoryFormOpen
}) {
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

  const { t } = useTranslation(['form', 'common']);
  const [categoryData, setCategoryData] = useState(initialData);
  const [info, setInfo] = useState({ error: false, message: '' });
  const [createCategory, { loading, called }] = useMutation(FormCategoryCreateMutation);
  const [updateCategory, { loading: updateLoading, called: updateCalled }] = useMutation(
    FormCategoryUpdateMutation
  );
  const { formId } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const smDownHidden = useMediaQuery(theme => theme.breakpoints.down('sm'));

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
    const { condition, groupingId, value, ...catData } = categoryData;
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
      }
    })
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
    const { condition, groupingId, value, ...catData } = categoryData;
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
      <CustomizedDialogs
        handleModal={handleCategoryClose}
        open={categoryFormOpen}
        dialogHeader={data?.id ? t('form:misc.update_category') : t('form:misc.add_category')}
        dividers={false}
        disableActionBtn={loading || updateLoading}
        handleBatchFilter={data.id ? handleUpdateCategory : handleSaveCategory}
      >
        <Grid container className={classes.container}>
          <Grid item sm={12} xs={12}>
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
          </Grid>
          <Grid item sm={12} xs={12}>
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
              multiline
              required
            />
          </Grid>
          <Grid item xs={12} md={12} style={{ padding: '20px 0' }}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography gutterBottom variant="caption">
              {t('misc.display_condition')}
            </Typography>
          </Grid>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
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
            <Grid item sm={1} xs={12} data-testid="clear_condition">
              {!smDownHidden && (
                <IconButton onClick={clearDisplayCondition}>
                  <CancelIcon />
                </IconButton>
              )}
              {smDownHidden && (
                <Button color="primary" onClick={clearDisplayCondition}>
                  {t('actions.clear_condition')}
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item md={12} xs={12}>
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
              multiline
            />
          </Grid>
          <Grid item xs={12} md={12} style={{ padding: '20px 0' }}>
            <Divider />
          </Grid>
          <Grid container>
            <Grid item md={4} xs={6}>
              <SwitchInput
                name="headerVisible"
                label={t('form_fields.header_visible')}
                value={categoryData.headerVisible || false}
                handleChange={handleRadioChange}
                className="form-category-header-visible-switch-btn"
                labelPlacement="end"
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <SwitchInput
                name="general"
                label={t('form_fields.general_category')}
                value={categoryData.general || false}
                handleChange={handleRadioChange}
                labelPlacement="end"
              />
            </Grid>
            <Grid item md={4} xs={12}>
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
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} style={{ paddingTop: '20px' }}>
            <Divider />
          </Grid>
        </Grid>
      </CustomizedDialogs>
    </>
  );
}
const useStyles = makeStyles({
  clearTex: {
    marginTop: -17
  },
  container: {
    paddingTop: '0 20px'
  }
});

CategoryForm.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    fieldName: PropTypes.string,
    displayCondition: PropTypes.shape({
      condition: PropTypes.string,
      groupingId: PropTypes.string,
      value: PropTypes.string
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
  ).isRequired,
  handleCategoryClose: PropTypes.func.isRequired,
  categoryFormOpen: PropTypes.bool.isRequired
};
