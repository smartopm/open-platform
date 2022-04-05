import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useLazyQuery } from 'react-apollo';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
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
import CenteredContent from '../../../shared/CenteredContent'

export default function FormCreate({
  formMutation,
  refetch,
  formId,
  actionType,
  routeBack
}) {
  const [formDataQuery, { data: formData, error: formError, loading: formLoading }] = useLazyQuery(
    FormQuery,
    {
      variables: { id: formId }
    }
  );
  const { t } = useTranslation(['form', 'common']);
  const history = useHistory();
  const matches = useMediaQuery('(max-width:900px)');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [expiresAt, setExpiresAtDate] = useState(null);
  const [multipleSubmissionsAllowed, setMultipleSubmissionsAllowed] = useState(true);
  const [preview, setPreview] = useState(false);
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
    if (formData?.form) {
      setTitle(formData?.form?.name);
      setDescription(formData?.form?.description);
      setRoles(formData?.form?.roles);
      setExpiresAtDate(formData?.form?.expiresAt);
      setMultipleSubmissionsAllowed(formData?.form.multipleSubmissionsAllowed)
      setPreview(formData?.form.preview)
    }
  }, [formId, formData, formDataQuery]);

  return formLoading ? (
    <Spinner />
  ) : (
    <Grid>
      {formError && (
        <CenteredContent><p>{formError.message}</p></CenteredContent>
      )}
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={handleClose}
      />
      <Grid container spacing={4}>
        <Grid item md={12} xs={12}>
          <TextField
            name="title"
            id="outlined-basic"
            label="Form Title"
            variant="outlined"
            onChange={e => setTitle(e.target.value)}
            value={title}
            inputProps={{
              'data-testid': 'title'
            }}
            fullWidth
            required
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <TextField
            id="outlined-basic"
            label="Form Description"
            variant="outlined"
            name="description"
            inputProps={{
              'data-testid': 'description'
            }}
            multiline
            maxRows={5}
            fullWidth
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <FormRoleSelect
            data={communityRoles}
            inputLabel="Select Roles"
            handleChange={val => setRoles(val)}
            roles={roles}
          />
        </Grid>
        <Grid item md={6} xs={12} data-testid='datepicker'>
          <DateAndTimePickers
            label={t('misc.form_expiry_date')}
            selectedDateTime={expiresAt}
            handleDateChange={date => setExpiresAtDate(date)}
            inputVariant="outlined"
            pastDate
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="column">
            <Grid item md={12} xs={12}>
              <SwitchInput
                name="multipleSubmissionsAllowed"
                label={t('misc.limit_1_response')}
                value={!multipleSubmissionsAllowed}
                handleChange={event => setMultipleSubmissionsAllowed(!event.target.checked)}
                labelPlacement="start"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <SwitchInput
                name="previewable"
                label={t('misc.previewable')}
                value={preview}
                handleChange={event => setPreview(event.target.checked)}
                className="form-previewbale-switch-btn"
                labelPlacement="start"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          <Divider />
        </Grid>
        <Grid item md={6} xs={6} style={matches ? {textAlign: 'center'} : { textAlign: 'right' }}>
          <Button variant="outlined" disabled={isLoading} onClick={() => history.push('/forms')}>
            Cancel
          </Button>
        </Grid>
        <Grid item md={6} xs={6} style={matches ? { textAlign: 'center'} : { textAlign: 'left' }}>
          <Button variant="contained" disabled={isLoading} onClick={submitForm} data-testid='submit'>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

FormCreate.defaultProps = {
  routeBack: false,
  actionType: null,
  formId: null
};

FormCreate.propTypes = {
  formId: PropTypes.string,
  formMutation: PropTypes.func.isRequired,
  actionType: PropTypes.string,
  refetch: PropTypes.func.isRequired,
  routeBack: PropTypes.bool
};
