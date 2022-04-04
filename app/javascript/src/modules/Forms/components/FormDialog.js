import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TitleDescriptionForm from './TitleDescriptionForm';
import { DateAndTimePickers } from '../../../components/DatePickerDialog';
import { formatError } from '../../../utils/helpers';
import SwitchInput from './FormProperties/SwitchInput';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../shared/CenteredContent';

export default function FormDialog({
  actionType,
  form,
  formMutation,
  open,
  setOpen,
  message,
  setMessage,
  setAlertOpen,
  refetch
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation('form');
  const [expiresAt, setExpiresAtDate] = useState(form?.expiresAt || null);
  const [isLoading, setLoading] = useState(false);
  const [multipleSubmissionsAllowed, setMultipleSubmissionsAllowed] = useState(
    form ? form.multipleSubmissionsAllowed : true
  );
  const [preview, setPreview] = useState(form ? form.preview : false);
  const authState = React.useContext(AuthStateContext);
  const [roles, setRoles] = useState(form?.roles || []);
  const communityRoles = authState?.user?.community?.roles;

  function handleDateChange(date) {
    setExpiresAtDate(date);
  }

  function submitForm(title, description) {
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
        refetch();
        setLoading(false);
        setOpen(!open);
        if (actionType === 'update') {
          window.location.reload();
        }
      })
      .catch(err => {
        setLoading(false);
        setMessage({ isError: true, detail: formatError(err.message) });
        setAlertOpen(true);
      });
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      fullWidth
      maxWidth="lg"
      onClose={() => setOpen(!open)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <CenteredContent>
          <span>
            {actionType === 'create' ? t('actions.create_a_form') : t('actions.edit_form')}
          </span>
        </CenteredContent>
      </DialogTitle>
      <DialogContent>
        <TitleDescriptionForm
          formTitle={form?.name || ''}
          formDescription={form?.description || ''}
          close={() => setOpen(false)}
          type="form"
          save={submitForm}
          data={{
            loading: isLoading,
            msg: message.detail
          }}
        >
          <div style={{ marginLeft: '-15px', display: 'inline-block' }}>
            <SwitchInput
              name="multipleSubmissionsAllowed"
              label={t('misc.limit_1_response')}
              value={!multipleSubmissionsAllowed}
              handleChange={event => setMultipleSubmissionsAllowed(!event.target.checked)}
            />

            <SwitchInput
              name="previewable"
              label={t('misc.previewable')}
              value={preview}
              handleChange={event => setPreview(event.target.checked)}
              className="form-previewbale-switch-btn"
            />
            <SwitchInput
              name="public"
              label={t('misc.public')}
              value={preview}
              handleChange={event => setPreview(event.target.checked)}
              className="form-previewbale-switch-btn"
            />
          </div>
          <div>
            <FormControl style={{ minWidth: 250, maxWidth: 400 }}>
              <InputLabel id="multiple-roles-label">{t('misc.select_roles')}</InputLabel>
              <Select
                id="multiple-roles"
                multiple
                value={roles}
                onChange={event => setRoles(event.target.value)}
                MenuProps={{
                  getContentAnchorEl: () => null,
                  PaperProps: {
                    style: {
                      maxHeight: 190,
                      minWidth: 250,
                      marginTop: 35
                    }
                  }
                }}
              >
                {communityRoles &&
                  communityRoles.map(key => (
                    <MenuItem key={key} value={key}>
                      {t(`common:user_types.${key}`)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <DateAndTimePickers
            label={t('misc.form_expiry_date')}
            selectedDateTime={expiresAt}
            handleDateChange={handleDateChange}
            pastDate
          />
        </TitleDescriptionForm>
      </DialogContent>
    </Dialog>
  );
}

FormDialog.defaultProps = {
  refetch: () => {},
  actionType: 'create',
  form: null
};

FormDialog.propTypes = {
  actionType: PropTypes.string,
  form: PropTypes.shape({
    id: PropTypes.string.isRequired,
    multipleSubmissionsAllowed: PropTypes.bool.isRequired,
    preview: PropTypes.bool.isRequired,
    expiresAt: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  formMutation: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  message: PropTypes.shape({
    detail: PropTypes.string.isRequired,
    isError: PropTypes.bool.isRequired
  }).isRequired,
  setMessage: PropTypes.func.isRequired,
  setAlertOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func
};