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
import { Spinner } from '../../../shared/Loading'
import { FormQuery } from '../graphql/forms_queries';

export default function FormCreate({ formMutation, refetch, formId, actionType }) {
  const [formDataQuery, { data: form, error: formError, loading: formLoading }] = useLazyQuery(
    FormQuery,
    {
      variables: { id: formId }
    }
  );
  const { t } = useTranslation(['form', 'common']);
  const classes = useStyles();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(form?.description || '');
  const [roles, setRoles] = useState(form?.roles || []);
  const [isLoading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [expiresAt, setExpiresAtDate] = useState(form?.expiresAt || null);
  const [multipleSubmissionsAllowed, setMultipleSubmissionsAllowed] = useState(
    form ? form.multipleSubmissionsAllowed : true
  );
  const [preview, setPreview] = useState(form ? form.preview : false);
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
      variables.id = form?.id;
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
        history.push('/forms');
      })
      .catch(err => {
        setLoading(false);
        setMessage({ isError: true, detail: formatError(err.message) });
        setAlertOpen(true);
      });
  }

  useEffect(() => {
    if (formId) {
      formDataQuery();
    }
    if (form) {
      setTitle(form.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, form]);
  return (
    formLoading ? (
      <Spinner />
    ) : (
      <Container>
        {console.log(form)}
        <Container>
          <MessageAlert
            type={message.isError ? 'error' : 'success'}
            message={message.detail}
            open={alertOpen}
            handleClose={() => setMessage({ isError: false, detail: '' })}
          />
          <Grid container className={classes.container} spacing={4}>
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
                handleChange={(val) => setRoles(val)}
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
              <Button variant="outlined" disable={isLoading} onClick={() => history.push('/forms')}>Cancel</Button>
            </Grid>
            <Grid item md={6} style={{ textAlign: 'left' }}>
              <Button variant="contained" disable={isLoading} onClick={submitForm}>Submit</Button>
            </Grid>
          </Grid>
        </Container>
      </Container>
    )
  );
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '100px 150px'
  }
}));
