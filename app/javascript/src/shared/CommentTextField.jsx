import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Typography, useMediaQuery } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import UserAutoResult from './UserAutoResult';
import { UserChip } from '../modules/Tasks/Components/UserChip';
import { Context as AuthStateContext } from '../containers/Provider/AuthStateProvider';

export default function CommentTextField({
  value,
  setValue,
  handleSubmit,
  actionTitle,
  placeholder,
  loading,
  forProcess,
  selectedUser,
  setSelectedUser,
  autoCompleteOpen,
  setAutoCompleteOpen,
  taskAssignees
}) {
  const { t } = useTranslation(['task', 'common']);
  const authState = React.useContext(AuthStateContext);
  const matches = useMediaQuery('(max-width:800px)');

  return (
    <Grid container alignContent="space-between">
      <Grid item md={10} xs={8} style={{ paddingRight: '10px' }}>
        <TextField
          fullWidth
          id="standard-full-width"
          style={{ margin: 0 }}
          label={placeholder}
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
          disabled={!value.trim() || loading}
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
          {forProcess && authState?.user?.userType === 'admin' && (
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
        <Grid item xs={8} style={autoCompleteOpen ? { marginBottom: '15px' } : {}}>
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
              style={{
                width: matches ? 320 : '100%',
                marginLeft: matches && -100,
                marginTop: matches && 50
              }}
              id="reply-user"
              options={taskAssignees || []}
              renderOption={(props, option) => (
                <li {...props}>
                  <UserAutoResult user={option} t={t} />
                </li>
              )}
              name="reply-user"
              onChange={(_event, newValue) => setSelectedUser(newValue)}
              getOptionLabel={option => option?.name}
              isOptionEqualToValue={(option, optionValue) => option.name === optionValue.name}
              value={selectedUser}
              noOptionsText="No valid assignees on this project"
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t('task.search_users')}
                  autoComplete="off"
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
  selectedUser: null,
  setSelectedUser: null,
  autoCompleteOpen: false,
  setAutoCompleteOpen: null,
  taskAssignees: null
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
  taskAssignees: PropTypes.array
};
