// Business Name, Status, Website, Category, Description,
// Image Upload, Email, Phone Number, Address Operating Hours

import React, { useState } from 'react';
import {
  TextField, Container, Button, Typography, FormControl, InputLabel, Select, MenuItem, Grid
} from '@material-ui/core';
import { css } from 'aphrodite';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import EditIcon from '@material-ui/icons/Edit';
import CenteredContent from '../../../shared/CenteredContent';
import { discussStyles } from '../../../components/Discussion/Discuss';
import { BusinessCreateMutation, BusinessUpdateMutation } from '../graphql/business_mutations';
import UserSearch from '../../Users/Components/UserSearch';
import { businessCategories, businessStatus } from '../../../utils/constants';

const initialData = {
  name: '',
  email: '',
  phoneNumber: '',
  status: '',
  homeUrl: '',
  category: '',
  description: '',
  imageUrl: '',
  address: '',
  operationHours: ''
};

const initialUserData = {
  user: '',
  userId: ''
};

export default function BusinessForm({ close, businessData, action }) {
  const [data, setData] = useState(action === 'edit' ? businessData : initialData);
  const [userData, setUserData] = useState(action === 'edit' ? { userId: businessData?.userId } : initialUserData);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(false);
  const { t } = useTranslation(['common']);

  const [createBusiness] = useMutation(BusinessCreateMutation);
  const [updateBusiness] = useMutation(BusinessUpdateMutation);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const {
      name, email, phoneNumber, status, homeUrl, category, description, imageUrl, address, operationHours,
    } = data;

    if(action === 'edit'){
      updateBusiness({
        variables: {
          id: businessData.id, name, email, phoneNumber, status, homeUrl, category, description, imageUrl, address, operationHours, userId: userData.userId
        }
      }).then(() => {
        close()
      }).catch((err) => setError(err.message));
    }else{
      createBusiness({
        variables: {
          name, email, phoneNumber, status, homeUrl, category, description, imageUrl, address, operationHours, userId: userData.userId
        }
      }).then(() => {
        close();
      }).catch((err) => setError(err.message));
    }
  }
  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit}>
        <TextField
          label={t('form_fields.full_name')}
          name="name"
          className="form-control"
          value={data.name}
          onChange={handleInputChange}
          aria-label="business_name"
          inputProps={{ 'data-testid': 'business_name' }}
          required
          margin="normal"
        />

        <br />
        {(editingUser || action === 'create') && <UserSearch userData={userData} update={setUserData} required={!editingUser} />}
        {(!editingUser && data?.user) && (
          <>
            <Grid container>
              <Grid item sm={11} xs={11}>
                <TextField
                  label={t('misc.user')}
                  name="email"
                  className="form-control"
                  value={data?.user?.name}
                  aria-label="business_user"
                  inputProps={{ 'data-testid': 'business_user' }}
                  margin="normal"
                  disabled
                  required
                />
              </Grid>
              <Grid item sm={1} xs={1}>
                <EditIcon style={{ marginBottom: '-40px', marginLeft: '7px' }} fontSize="small" onClick={() => setEditingUser(true)} />
              </Grid>
            </Grid>
          </>
        )}

        <TextField
          label={t('form_fields.email')}
          name="email"
          className="form-control"
          value={data.email}
          onChange={handleInputChange}
          aria-label="business_email"
          inputProps={{ 'data-testid': 'business_email' }}
          margin="normal"
          required
        />
        <TextField
          label={t('form_fields.phone_number')}
          name="phoneNumber"
          className="form-control"
          value={data.phoneNumber}
          onChange={handleInputChange}
          aria-label="business_phone_number"
          inputProps={{ 'data-testid': 'business_phone_number' }}
          required
        />
        <TextField
          label={t('form_fields.home_url')}
          name="homeUrl"
          className="form-control"
          value={data.homeUrl}
          onChange={handleInputChange}
          aria-label="business_link"
          inputProps={{ 'data-testid': 'business_link' }}
          margin="normal"
        />

        <TextField
          label={t('form_fields.logo_url')}
          name="imageUrl"
          className="form-control"
          value={data.imageUrl}
          onChange={handleInputChange}
          aria-label="business_link"
          inputProps={{ 'data-testid': 'business_image' }}
          margin="normal"
        />
        <TextField
          label={t('table_headers.description')}
          name="description"
          className="form-control"
          value={data.description}
          onChange={handleInputChange}
          aria-label="business_description"
          inputProps={{ 'data-testid': 'business_description' }}
          multiline
          rowsMax={4}
          margin="normal"
        />
        <TextField
          label={t('form_fields.primary_address')}
          name="address"
          className="form-control"
          value={data.address}
          onChange={handleInputChange}
          aria-label="business_address"
          inputProps={{ 'data-testid': 'business_address' }}
          margin="normal"
        />

        <FormControl fullWidth>
          <InputLabel id="type">{t('table_headers.status')}</InputLabel>
          <Select
            id="type"
            value={data.status}
            onChange={handleInputChange}
            name="status"
            inputProps={{ 'data-testid': 'business_status' }}
            fullWidth
            required
          >
            {Object.entries(businessStatus).map(([key, val]) => (
              <MenuItem key={key} value={key}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="type">{t('misc.select_category')}</InputLabel>
          <Select
            id="type"
            value={data.category}
            onChange={handleInputChange}
            name="category"
            inputProps={{ 'data-testid': 'business_category' }}
            fullWidth
          >
            {Object.entries(businessCategories).map(([key, val]) => (
              <MenuItem key={key} value={key}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label={t('form_fields.operating_hours')}
          name="operationHours"
          className="form-control"
          value={data.operationHours}
          onChange={handleInputChange}
          aria-label="business_operating_hours"
          inputProps={{ 'data-testid': 'business_operating_hours' }}
          margin="normal"
        />
        <br />
        {error && (
          <Typography
            align="center"
            color="textSecondary"
            gutterBottom
            variant="h6"
          >
            {error}
          </Typography>
        )}
        <br />
        <CenteredContent>
          <Button
            variant="contained"
            aria-label="business_cancel"
            color="secondary"
            className={`${css(discussStyles.cancelBtn)}`}
            onClick={close}
          >
            {t('form_actions.cancel')}
          </Button>
          <Button
            variant="contained"
            type="submit"
            aria-label="business_submit"
            color="primary"
            className={`${css(discussStyles.submitBtn)}`}
            data-testid='create_business'
          >
            {action === 'edit' ? t('form_actions.update_business') : t('form_actions.create_business')}
          </Button>
        </CenteredContent>
      </form>
    </Container>
  );
}

BusinessForm.defaultProps = {
  businessData: {},
  action: 'create'
}

BusinessForm.propTypes = {
  close: PropTypes.func.isRequired,
  businessData: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string
  }),
  action: PropTypes.string
};
