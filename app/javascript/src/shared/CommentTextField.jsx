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
import ReusableMentionsInput from './ReusableMentionsInput';

export default function CommentTextField({
  value,
  setValue,
  handleSubmit,
  actionTitle,
  loading,
  forProcess,
  selectedUser,
  setSelectedUser,
  autoCompleteOpen,
  setAutoCompleteOpen,
  taskAssignees,
  mentionsData,
  setMentionedDocuments
}) {
  const { t } = useTranslation(['task', 'common']);
  const authState = React.useContext(AuthStateContext);
  const matches = useMediaQuery('(max-width:800px)');

  return (
    <Grid container alignContent="space-between">
      <Grid item md={10} xs={8} style={{ paddingRight: '10px' }}>
        <ReusableMentionsInput
          commentValue={value}
          setCommentValue={setValue}
          data={mentionsData}
          setMentions={setMentionedDocuments}
        />
      </Grid>
      <Grid item md={2} xs={2}>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          disabled={!value.trim() || loading}
          data-testid="comment_btn"
          style={{ height: '44px', width: '80px' }}
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
  taskAssignees: null,
  mentionsData: []
};

CommentTextField.propTypes = {
  value: PropTypes.string.isRequired,
  actionTitle: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  forProcess: PropTypes.bool,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
  autoCompleteOpen: PropTypes.bool,
  setAutoCompleteOpen: PropTypes.func,
  taskAssignees: PropTypes.array,
  setMentionedDocuments: PropTypes.func.isRequired,
  mentionsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display: PropTypes.string
    })
  )
};
