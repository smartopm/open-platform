import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useLazyQuery } from 'react-apollo';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import { DateAndTimePickers } from '../../../components/DatePickerDialog';
import FormRoleSelect from './FormRoleSelect';
import SwitchInput from './FormProperties/SwitchInput';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { formatError } from '../../../utils/helpers';
import MessageAlert from '../../../components/MessageAlert';
import { Spinner } from '../../../shared/Loading';
import { FormQuery } from '../graphql/forms_queries';

// Update the proptypes
// handle error when fetching
export default function FormCreate({
  formMutation,
  refetch,
  formId,
  actionType,
  style,
  routeBack
}) {
  const [formDataQuery, { data: formData, error: formError, loading: formLoading }] = useLazyQuery(
    FormQuery,
    {
      variables: { id: formId }
    }
  );
  const { t } = useTranslation(['form', 'common']);
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(formData?.form?.description || '');
  const [roles, setRoles] = useState(formData?.form?.roles || []);
  const [isLoading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [expiresAt, setExpiresAtDate] = useState(formData?.form?.expiresAt || null);
  const [multipleSubmissionsAllowed, setMultipleSubmissionsAllowed] = useState(
    formData?.form ? formData?.form.multipleSubmissionsAllowed : true
  );
  const [preview, setPreview] = useState(formData?.form ? formData?.form.preview : false);
  const authState = useContext(AuthStateContext);
  const communityRoles = authState?.user?.community?.roles;

  function submitForm() {
    const variables = {
      name: title,
      expiresAt,
      description,
      multipleSubmissionsAllowed,
      preview,
      roles
    };
    if (actionType === 'update') {
      variables.id = formData?.form?.id;
    }
    setLoading(true);
    formMutation({
      variables
    })
      .then(() => {
        setMessage({
          isError: false,
          detail: actionType === 'update' ? t('misc.form_updated') : t('misc.form_created')
        });
        setAlertOpen(true);
        setLoading(false);
        refetch();
        if (routeBack) {
          history.push('/forms');
        }
      })
      .catch(err => {
        setLoading(false);
        setMessage({ isError: true, detail: formatError(err.message) });
        setAlertOpen(true);
      });
  }

  function handleClose() {
    setMessage({ isError: false, detail: '' });
    setAlertOpen(false);
  }

  useEffect(() => {
    if (formId) {
      formDataQuery();
    }
    // Refactor this to make it cleaner
    // Issue was that we were getting name from a wrong object
    if (formData?.form) {
      setTitle(formData?.form?.name);
      setDescription(formData?.form?.description);
      setRoles(formData?.form?.roles);
      setExpiresAtDate(formData?.form?.expiresAt);
    }
  }, [formId, formData, formDataQuery]);

  return formLoading ? (
    <Spinner />
  ) : (
    <>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={handleClose}
      />
      <Grid container style={{ style }} spacing={4}>
        <Grid item md={12}>
          <TextField
            name="title"
            id="outlined-basic"
            label="Form Title"
            variant="outlined"
            onChange={e => setTitle(e.target.value)}
            value={title}
            fullWidth
            required
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            id="outlined-basic"
            label="Form Description"
            variant="outlined"
            name="description"
            multiline
            maxRows={5}
            fullWidth
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </Grid>
        <Grid item md={12}>
          <FormRoleSelect
            data={communityRoles}
            inputLabel="Select Roles"
            handleChange={val => setRoles(val)}
            roles={roles}
          />
        </Grid>
        <Grid item md={6}>
          <DateAndTimePickers
            label={t('misc.form_expiry_date')}
            selectedDateTime={expiresAt}
            handleDateChange={date => setExpiresAtDate(date)}
            inputVariant="outlined"
            pastDate
          />
        </Grid>
        <Grid item>
          <Grid container direction="column">
            <Grid item md={12}>
              <SwitchInput
                name="multipleSubmissionsAllowed"
                label={t('misc.limit_1_response')}
                value={!multipleSubmissionsAllowed}
                handleChange={event => setMultipleSubmissionsAllowed(!event.target.checked)}
                labelPlacement="right"
              />
            </Grid>
            <Grid item md={12}>
              <SwitchInput
                name="previewable"
                label={t('misc.previewable')}
                value={preview}
                handleChange={event => setPreview(event.target.checked)}
                className="form-previewbale-switch-btn"
                labelPlacement="right"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12}>
          <Divider />
        </Grid>
        <Grid item md={6} style={{ textAlign: 'right' }}>
          <Button variant="outlined" disable={isLoading} onClick={() => history.push('/forms')}>
            Cancel
          </Button>
        </Grid>
        <Grid item md={6} style={{ textAlign: 'left' }}>
          <Button variant="contained" disable={isLoading} onClick={submitForm}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '100px 150px'
  }
}));
