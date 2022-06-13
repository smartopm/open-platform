import React from 'react';
import Autocomplete from '@mui/material/Autocomplete'
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';
import { useLazyQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UsersLiteQuery } from '../../../graphql/queries';
import UserAutoResult from '../../../shared/UserAutoResult';
import useDebounce from '../../../utils/useDebounce';

// TODO: should be moved to shared directory
export default function UserSearch({ userData, update, required }) {
  const { t } = useTranslation('common')
  const debouncedValue = useDebounce(userData.user, 500);
  const classes = useStyles();
  const [searchUser, { data }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: debouncedValue, limit: 10 },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  return (
    <>
      <Autocomplete
        style={{ width: "100%" }}
        id="user-input"
        data-testid="user-input"
        options={data?.usersLite || []}
        getOptionLabel={option => option?.name}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        onChange={(_event, newValue) => update({ ...userData, userId: newValue.id })}
        classes={{ option: classes.autocompleteOption, listbox: classes.autocompleteOption }}
        renderOption={(props, option) => (
          <li {...props}>
            <UserAutoResult user={option} t={t} />
          </li>
        )}
        renderInput={params => (
          <TextField
            {...params}
            label="Type user name here"
            style={{ width: "100%" }}
            name="name"
            onChange={event => update({ ...userData, user: event.target.value })}
                      // eslint-disable-next-line no-unused-vars
            onKeyDown={(_e) => searchUser()}
            required={required}
          />
      )}
      />
    </>
);
}

const useStyles = makeStyles(() => ({
  autocompleteOption: {
    padding: '0px'
  }
}));

UserSearch.defaultProps = {
  required: false
}

UserSearch.propTypes = {
  update: PropTypes.func.isRequired,
  userData: PropTypes.exact({
    user: PropTypes.string,
    userId: PropTypes.string,
    imageUrl: PropTypes.string
  }).isRequired,
  required: PropTypes.bool
};
