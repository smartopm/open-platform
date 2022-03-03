import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';
import UserAutoResult from './UserAutoResult';
import { UserChip } from '../modules/Tasks/Components/UserChip';

export default function CommentTextField({
  value,
  setValue,
  handleSubmit,
  actionTitle,
  placeholder,
  loading,
  forProcess,
  processesProps,
  selectedUser,
  setSelectedUser,
  autoCompleteOpen,
  setAutoCompleteOpen
}) {
  const { t } = useTranslation(['task', 'common']);

  useEffect(() => {
    if (processesProps) {
      processesProps.setSearchUser('user_type:developer');
    }
  }, [processesProps]);

  return (
    <Grid container alignContent="space-between">
      <Grid item md={10} xs={8} style={{ paddingRight: '10px' }}>
        <TextField
          fullWidth
          id="standard-full-width"
          style={{ margin: 0 }}
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          multiline
          size="small"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{ 'data-testid': 'body_input' }}
        />
      </Grid>
      <Grid item md={2} xs={2}>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          disabled={!value.length || loading}
          data-testid="comment_btn"
          style={{ height: '40px', width: '80px', padding: '5px' }}
          onClick={handleSubmit}
          size="small"
          fullWidth
        >
          {actionTitle}
        </Button>
      </Grid>
      <>
        <Grid item xs={4}>
          {forProcess && (
            <FormControlLabel
              control={(
                <Checkbox
                  checked={autoCompleteOpen}
                  onChange={() => setAutoCompleteOpen(!autoCompleteOpen)}
                  name="require-reply"
                  data-testid="require_reply"
                  color="primary"
                />
              )}
              label={<Typography variant="body2">{t('task.require_a_reply')}</Typography>}
            />
          )}
        </Grid>
        <Grid item xs={8} style={{ marginBottom: '15px' }}>
          {selectedUser && autoCompleteOpen && (
            <UserChip
              user={selectedUser}
              size="medium"
              onDelete={() => {
                setSelectedUser(null);
              }}
            />
          )}
          {autoCompleteOpen && !selectedUser && (
            <Autocomplete
              data-testid="users_autocomplete"
              style={{ width: '100%' }}
              id="reply-user"
              options={processesProps.userData?.usersLite || []}
              renderOption={option => <UserAutoResult user={option} t={t} />}
              name="reply-user"
              onChange={(_event, newValue) => setSelectedUser(newValue)}
              getOptionLabel={option => option?.name}
              getOptionSelected={(option, optionValue) => option.name === optionValue.name}
              value={selectedUser}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t('task.search_users')}
                  onChange={event =>
                    processesProps.setSearchUser(`${event.target.value} AND user_type:developer`)
                  }
                  autoComplete="off"
                  onKeyDown={() => processesProps.searchUser()}
                  style={{ marginTop: '5px' }}
                />
              )}
            />
          )}
        </Grid>
      </>
    </Grid>
  );
}
CommentTextField.defaultProps = {
  loading: false,
  forProcess: false,
  processesProps: null,
  selectedUser: null,
  setSelectedUser: null,
  autoCompleteOpen: false,
  setAutoCompleteOpen: null
};

CommentTextField.propTypes = {
  value: PropTypes.string.isRequired,
  actionTitle: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  forProcess: PropTypes.bool,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
  autoCompleteOpen: PropTypes.bool,
  setAutoCompleteOpen: PropTypes.func,
  processesProps: PropTypes.shape({
    searchUser: PropTypes.func.isRequired,
    setSearchUser: PropTypes.func.isRequired,
    userData: PropTypes.shape({
      usersLite: PropTypes.array
    })
  })
};
