import React, { useState } from 'react';
import { Button, Grid, Typography, TextField } from '@material-ui/core';
import { useLazyQuery, useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
import { MergeUsersMutation } from '../../../graphql/mutations';
import { ModalDialog } from '../../../components/Dialog';
import useDebounce from '../../../utils/useDebounce';
import { UsersLiteQuery } from '../../../graphql/queries';
import MessageAlert from '../../../components/MessageAlert';

export default function UserMerge({ userId, close }) {
  const [merge] = useMutation(MergeUsersMutation);
  const [loading, setLoading] = useState(false);
  const [open, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [searchedUser, setSearchUser] = useState('');
  const [duplicateUserId, setDuplicateUserId] = useState(null)
  const debouncedValue = useDebounce(searchedUser, 500);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const { t } = useTranslation(['common', 'users'])

  const [searchUser, { data }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: debouncedValue, limit: 10 },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  function handleMerge() {
    setLoading(true);
    setConfirmOpen(false);
    merge({
      variables: { id: userId, duplicateId: duplicateUserId }
    })
      .then(() => {
          setLoading(false);
      setIsSuccessAlert(true)
      setMessage(t('users:users.user_merged'));
      // delay the closing of the modal to allow the success message to show
      setTimeout(() => close(), 1000)
      })
      .catch(err => {
        setMessage(err.message);
        setLoading(false);
        setIsSuccessAlert(false)
      });
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessage("");
  }

  function handleConfirmMerge() {
    if (!duplicateUserId) {
      setMessage(t('errors.no_user_selected'));
      return;
    }
    setConfirmOpen(!open);
  }
  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={message}
        open={!!message}
        handleClose={handleMessageAlertClose}
      />
      <ModalDialog
        open={open}
        handleClose={() => setConfirmOpen(!open)}
        handleConfirm={handleMerge}
        action="proceed"
      >
        <Typography variant="body1">
          {t('misc.user_merge_warning_text')}
        </Typography>
      </ModalDialog>

      <Autocomplete
        style={{ width: '100%' }}
        id="user_to_be_merged"
        options={data?.usersLite || []}
        getOptionLabel={option => option?.name}
        getOptionSelected={(option, value) => option.name === value.name}
        onChange={(_event, user) => setDuplicateUserId(user.id)}
        renderInput={params => (
          <TextField
            {...params}
            label={t('form_fields.user_name_search')}
            style={{ width: '100%' }}
            name="name"
            onChange={event => setSearchUser(event.target.value)}
            onKeyDown={() => searchUser()}
            placeholder={t('form_fields.user_name_merge')}
            helperText={t('misc.user_name_search_warning_text')}
          />
        )}
      />
      <br />
      <br />
      <br />

      <Grid container direction="row-reverse" justify="space-around" alignItems="center">
        <Button variant="contained" aria-label="merge_cancel" color="secondary" onClick={close}>
          {t('form_actions.cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleConfirmMerge}
          aria-label="merge_btn"
        >
          {loading ? t('users:users.merging') : t('users:users.merge_user')}
        </Button>
      </Grid>
      <br />
    </>
  );
}
UserMerge.propTypes = {
  userId: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};
