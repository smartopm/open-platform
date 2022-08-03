import React, { useState } from 'react';
import { useLazyQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import { UsersLiteQuery } from '../../graphql/queries';
import useDebounce from '../../utils/useDebounce';
import UserAutoResult from '../UserAutoResult';

export default function CustomAutoComplete({ users, onChange, isMultiple, label }) {
  const [searchedUser, setSearchUser] = useState('');
  const debouncedValue = useDebounce(searchedUser, 500);
  const { t } = useTranslation('common');

  const allowedAssignees = [
    'admin',
    'custodian',
    'security_guard',
    'contractor',
    'site_worker',
    'consultant',
    'lead'
  ];

  const [searchUser, { data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: {
      query:
        debouncedValue.length > 0
          ? debouncedValue
          : 'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor',
      limit: 10
    },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  return (
    <Autocomplete
      data-testid="autocomplete"
      multiple={isMultiple}
      disablePortal
      id="custom-auto-complete"
      options={liteData?.usersLite || users}
      ListboxProps={{ style: { maxHeight: '20rem' } }}
      renderOption={(props, option) => (
        <li {...props}>
          <UserAutoResult user={option} t={t} />
        </li>
      )}
      name="assignees"
      onChange={onChange}
      getOptionLabel={option => (allowedAssignees.includes(option.userType) ? option.name : '')}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          label={label}
          placeholder={t('form_placeholders.search_user')}
          onChange={event => setSearchUser(event.target.value)}
          onKeyDown={() => searchUser()}
          data-testid="auto-complete-input"
        />
      )}
    />
  );
}

CustomAutoComplete.defaultProps = {
  users: []
};
const user = PropTypes.shape({
  accounts: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.string,
  avatarUrl: PropTypes.string,
  extRefId: PropTypes.string,
  id: PropTypes.string,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  userType: PropTypes.string
});
CustomAutoComplete.propTypes = {
  users: PropTypes.arrayOf(user),
  onChange: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired
};
