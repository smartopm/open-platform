/* eslint-disable react/forbid-prop-types */
import React, { useState, useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { StyleSheet, css } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { Spinner } from '../../../shared/Loading';
import ScanIcon from '../../../../../assets/images/shape.svg';
import { formatError } from '../../../utils/helpers';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../shared/CenteredContent';
import { UserSearchQuery } from '../../../graphql/queries';
import useDebounce from '../../../utils/useDebounce';
import UserAutoResult from '../../../shared/UserAutoResult';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import PageWrapper from '../../../shared/PageWrapper';

export function NewRequestButton() {
  const { t } = useTranslation('search');
  return (
    <CenteredContent>
      <Link className={css(styles.requestLink)} to="/new/user">
        <Button variant="contained" color="primary">
          {/* This should be renamed to Create a user */}
          {t('search.create_user_request')}
        </Button>
      </Link>
    </CenteredContent>
  );
}

export function Results({ data, loading, called }) {
  const { t } = useTranslation(['search', 'common']);
  function memberList(users) {
    return (
      <>
        {users.map(user => (
          <Link
            to={`/user/${user.id}`}
            key={user.id}
            data-testid="link_search_user"
            className={`${css(styles.linkStyles)} user-search-result`}
          >
            <UserAutoResult user={user} t={t} />
          </Link>
        ))}
        <br />
      </>
    );
  }
  if (called && loading) {
    return <Spinner />;
  }

  if (called && data) {
    return (
      <div className={`col-12 ${css(styles.results)}`}>
        {data.userSearch.length > 0 ? (
          memberList(data.userSearch)
        ) : (
          <div className={`${css(styles.noResults)}`}>
            <h4>{t('search.no_results')}</h4>
          </div>
        )}

        {/* only show this when the user is admin */}
        <AccessCheck module="user" allowedPermissions={['can_create_user']} show404ForUnauthorized={false}>
          <NewRequestButton />
        </AccessCheck>
      </div>
    );
  }
  return false;
}

export default function SearchContainer({ location }) {
  const [offset, setOffset] = useState(0);
  const [name, setName] = useState('');
  const debouncedValue = useDebounce(name, 500);
  const { t } = useTranslation(['search', 'common']);
  const limit = 50;
  const currentQueryPath = decodeURIComponent(location?.search).replace('?', '');
  const [searchQuery, setSearchQuery] = useState('');

  function updateSearch(e) {
    const { value } = e.target;
    setName(value);
  }

  const { called, loading, error, data, fetchMore } = useQuery(UserSearchQuery, {
    variables: { query: finalQuery(), limit, offset },
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (currentQueryPath) {
      setSearchQuery(currentQueryPath);
    }
  }, [currentQueryPath]);

  function finalQuery() {
    return searchQuery ? `${searchQuery} AND ${debouncedValue}` : debouncedValue;
  }

  const authState = useContext(Context);

  function loadMoreResults() {
    fetchMore({
      variables: { query: name, offset: data.userSearch.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return { ...prev, userSearch: [...prev.userSearch, ...fetchMoreResult.userSearch] };
      }
    });
    // Allow next search to go through all records
    setOffset(0);
  }

  if (
    !['security_guard', 'admin', 'custodian', 'security_supervisor', 'marketing_admin'].includes(
      authState.user?.userType.toLowerCase()
    )
  ) {
    return <Redirect to="/" />;
  }
  if (error && !/permission|permiso/.test(error.message)) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  return (
    <PageWrapper oneCol pageTitle={t('search.search')} loading={called && loading}>
      <div className={`${css(styles.inputGroup)}`}>
        <input
          className={`form-control ${css(styles.input)} user-search-input`}
          onChange={updateSearch}
          type="text"
          placeholder={t('common:form_placeholders.search')}
          value={name}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <Link to={(location.state && location.state.from) || '/'} className={css(styles.cancelBtn)}>
          <i className="material-icons">arrow_back</i>
        </Link>
        <Link to="/scan">
          <img src={ScanIcon} alt="scan icon" className={` ${css(styles.scanIcon)}`} />
        </Link>

        {name.length > 0 && (
          <>
            <Results {...{ data, loading, called, authState }} />
            {Boolean(called && data && data.userSearch.length) && (
              <Button data-testid="prev-btn" onClick={loadMoreResults} disabled={false}>
                {t('search.load_more')}
              </Button>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  results: {
    margin: '1em 0',
    padding: 0
  },
  linkStyles: {
    'text-decoration': 'none',
    color: '#222',
    ':hover': {
      'text-decoration': 'none',
      color: '#222'
    }
  },
  title: {
    color: '#222',
    'font-size': '0.9em',
    lineHeight: '0.5em',
    margin: '0.5em 0 0 0'
  },
  small: {
    'font-size': '0.8em',
    color: '#666'
  },
  avatar: {},
  vertCenter: {
    alignItems: 'center'
  },
  avatarImg: {
    'border-radius': '50%',
    width: '50px'
  },
  inputGroup: {
    border: '1px solid #AAA',
    'border-radius': '5px',
    position: 'relative',
    height: '48px',
    backgroundColor: '#FFF'
  },
  input: {
    height: '36px',
    border: 'none',
    width: '100%',
    padding: '0.7em 0 0em 3em',
    color: '#222',
    'background-image': 'none',
    '::placeholder': {
      color: '#999'
    }
  },
  cancelBtn: {
    color: '#666',
    position: 'absolute',
    left: '10px',
    top: '12px',
    bottom: '4px',
    'z-index': 9
  },
  scanIcon: {
    position: 'absolute',
    bottom: 4,
    right: 5,
    width: 24,
    height: 35
  },
  noResults: {
    margin: '4em 0',
    textAlign: 'center'
  },
  requestLink: {
    textDecorationLine: 'none'
  }
});

Results.defaultProps = {
  data: {},
  authState: {}
};
Results.propTypes = {
  data: PropTypes.object,
  called: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  authState: PropTypes.object
};

SearchContainer.defaultProps = {
  location: {}
};
SearchContainer.propTypes = {
  location: PropTypes.object
};
