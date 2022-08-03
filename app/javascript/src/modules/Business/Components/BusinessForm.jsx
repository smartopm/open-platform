// Business Name, Status, Website, Category, Description,
// Image Upload, Email, Phone Number, Address Operating Hours
/* eslint-disable max-lines */
import React, { useState } from 'react';
import {
  TextField,
  Container,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
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
  operationHours: '',
};

const initialUserData = {
  user: '',
  userId: '',
};

export default function BusinessForm({ close, businessData, action }) {
  const matches = useMediaQuery('(max-width:900px)');
  const [data, setData] = useState(action === 'edit' ? businessData : initialData);
  const [userData, setUserData] = useState(
    action === 'edit' ? { userId: businessData?.userId } : initialUserData
  );
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(false);
  const { t } = useTranslation(['common']);
  const [createBusiness] = useMutation(BusinessCreateMutation);
  const [updateBusiness] = useMutation(BusinessUpdateMutation);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const {
      name,
      email,
      phoneNumber,
      status,
      homeUrl,
      category,
      description,
      imageUrl,
      address,
      operationHours
    } = data;
    if (action === 'edit') {
      updateBusiness({
        variables: {
          id: businessData.id,
          name,
          email,
          phoneNumber,
          status,
          homeUrl,
          category,
          description,
          imageUrl,
          address,
          operationHours,
          userId: userData.userId
        }
      })
        .then(() => { close(); })
        .catch(err => setError(err.message));
    } else {
      createBusiness({
        variables: {
          name,
          email,
          phoneNumber,
          status,
          homeUrl,
          category,
          description,
          imageUrl,
          address,
          operationHours,
          userId: userData.userId
        }
      })
        .then(() => { close(); })
        .catch(err => setError(err.message));
    }
  }
  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item md={12} xs={12}>
            <TextField
              label={t('form_fields.full_name')}
              name="name"
              value={data.name}
              onChange={handleInputChange}
              aria-label="business_name"
              inputProps={{ 'data-testid': 'business_name' }}
              required
              margin="dense"
              fullWidth
            />
          </Grid>
          {(editingUser || action === 'create') && (
            <Grid item md={12} xs={12} style={{ padding: '20px 0 10px 0' }}>
              <UserSearch userData={userData} update={setUserData} required={!editingUser} />
            </Grid>
          )}
          {!editingUser && data?.user && (
            <>
              <Grid container>
                <Grid item md={11} xs={11}>
                  <TextField
                    label={t('misc.user')}
                    name="email"
                    value={data?.user?.name}
                    aria-label="business_user"
                    inputProps={{ 'data-testid': 'business_user' }}
                    margin="dense"
                    disabled
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item md={1} xs={1} style={{ textAlign: 'right' }}>
                  <IconButton color="primary" style={{ marginTop: '20px' }} size="large">
                    <EditIcon fontSize="small" onClick={() => setEditingUser(true)} />
                  </IconButton>
                </Grid>
              </Grid>
            </>
          )}
          <Grid item md={12} xs={12}>
            <TextField
              label={t('form_fields.email')}
              name="email"
              value={data.email}
              onChange={handleInputChange}
              aria-label="business_email"
              inputProps={{ 'data-testid': 'business_email' }}
              margin="dense"
              required
              fullWidth
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              label={t('form_fields.phone_number')}
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={handleInputChange}
              aria-label="business_phone_number"
              inputProps={{ 'data-testid': 'business_phone_number' }}
              required
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              label={t('form_fields.home_url')}
              name="homeUrl"
              value={data.homeUrl}
              onChange={handleInputChange}
              aria-label="business_link"
              inputProps={{ 'data-testid': 'business_link' }}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              label={t('form_fields.logo_url')}
              name="imageUrl"
              value={data.imageUrl}
              onChange={handleInputChange}
              aria-label="business_link"
              inputProps={{ 'data-testid': 'business_image' }}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              label={t('table_headers.description')}
              name="description"
              value={data.description}
              onChange={handleInputChange}
              aria-label="business_description"
              inputProps={{ 'data-testid': 'business_description' }}
              multiline
              maxRows={4}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              label={t('form_fields.primary_address')}
              name="address"
              value={data.address}
              onChange={handleInputChange}
              aria-label="business_address"
              inputProps={{ 'data-testid': 'business_address' }}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item md={12} xs={12} style={{ padding: '20px 0' }}>
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
                label="status"
              >
                {Object.entries(businessStatus).map(([key, val]) => (
                  <MenuItem key={key} value={key}>{val}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12} style={{ padding: '10px 0' }}>
            <FormControl fullWidth>
              <InputLabel id="type">{t('misc.select_category')}</InputLabel>
              <Select
                id="type"
                value={data.category}
                onChange={handleInputChange}
                name="category"
                inputProps={{ 'data-testid': 'business_category' }}
                fullWidth
                margin="dense"
                label="category"
              >
                {Object.entries(businessCategories).map(([key, val]) => (
                  <MenuItem key={key} value={key}>{val}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              label={t('form_fields.operating_hours')}
              name="operationHours"
              value={data.operationHours}
              onChange={handleInputChange}
              aria-label="business_operating_hours"
              inputProps={{ 'data-testid': 'business_operating_hours' }}
              fullWidth
              margin="dense"
            />
          </Grid>
          {error && (
            <Typography align="center" color="textSecondary" gutterBottom variant="h6">
              {error}
            </Typography>
          )}
          <br />
          <Grid
            item
            md={6}
            xs={12}
            style={matches ? { textAlign: 'center', paddingTop: '20px' } : { paddingTop: '20px' }}
          >
            <Button
              variant="contained"
              aria-label="business_cancel"
              color="secondary"
              onClick={close}
            >
              {t('form_actions.cancel')}
            </Button>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            style={
              matches
                ? { textAlign: 'center', paddingTop: '20px' }
                : { textAlign: 'right', paddingTop: '20px' }
            }
          >
            <Button
              variant="contained"
              type="submit"
              aria-label="business_submit"
              color="primary"
              data-testid="create_business"
            >
              {action === 'edit'
                ? t('form_actions.update_business')
                : t('form_actions.create_business')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

BusinessForm.defaultProps = {
  businessData: {},
  action: 'create'
};

BusinessForm.propTypes = {
  close: PropTypes.func.isRequired,
  businessData: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string
  }),
  action: PropTypes.string
};
