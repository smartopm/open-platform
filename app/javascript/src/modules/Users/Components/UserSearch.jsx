import React from 'react';
import {
  TextField,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  RadioGroup,
  Typography
} from '@material-ui/core';
import { useLazyQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UsersLiteQuery } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';

export default function UserSearch({ userData, update }) {
  const { t } = useTranslation('common')
  const [loadUsers, { loading: isLoading, error: queryErrors, data }] = useLazyQuery(
    UsersLiteQuery
  );

  function handleSearchUser(event) {
    update({ ...userData, user: event.target.value });

    setTimeout(() => {
      loadUsers({
        variables: {
          query: userData.user,
          errorPolicy: 'all',
          fetchPolicy: 'cache-and-network'
        }
      });
    }, 1000);
  }
  return (
    <>
      {!isLoading && !queryErrors ? (
        <>
          <TextField
            name="task user"
            label={t('form_fields.user_name_search')}
            placeholder={t('form_placeholders.user_name_search')}
            style={{ width: '100%' }}
            onChange={handleSearchUser}
            value={userData.user}
            fullWidth
            margin="normal"
            inputProps={{
              'aria-label': 'user'
            }}
            InputLabelProps={{
              shrink: true
            }}
          />
          <Typography variant="subtitle2" color="textSecondary">
            {t('misc.user_name_search_warning_text')}
          </Typography>
        </>
      ) : (
        <Spinner />
      )}
      {/* associated user */}
      {!isLoading && data?.usersLite.length ? (
        <FormControl component="fieldset">
          <FormLabel component="legend">{t('form_placeholders.user_name_search_choose_from_options')}</FormLabel>
          <RadioGroup
            aria-label="user"
            name="task_user"
            value={userData.userId}
            onChange={e => update({ ...userData, userId: e.target.value })}
          >
            {data?.usersLite.map(user => (
              <FormControlLabel
                key={user.id}
                value={user.id}
                control={<Radio color="primary" />}
                label={user.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ) : (
        Boolean(userData.user.length) &&
        Boolean(data?.usersLite.length) &&
        !isLoading &&
       `${t('errors.user_name_search_not_found', { username: userData.user})}`
      )}
      {// separate radios from checkbox only after search
      data?.usersLite.length && <hr />
}
    </>
  );
}

UserSearch.propTypes = {
  update: PropTypes.func.isRequired,
  userData: PropTypes.exact({
    user: PropTypes.string,
    userId: PropTypes.string,
    imageUrl: PropTypes.string
  }).isRequired
};
