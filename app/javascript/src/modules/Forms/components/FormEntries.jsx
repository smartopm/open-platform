import React, { useState } from 'react';
import { Grid,Typography, Avatar } from '@material-ui/core';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FormEntriesQuery } from '../graphql/forms_queries';
import Loading from '../../../shared/Loading';
import ErrorPage from '../../../components/Error';
import SearchInput from '../../../shared/search/SearchInput';
import ListHeader from '../../../shared/list/ListHeader';
import DataList from '../../../shared/list/DataList';
import CenteredContent from '../../../components/CenteredContent';
import { dateToString } from '../../../components/DateContainer';
import Text from '../../../shared/Text';
import useDebounce from '../../../utils/useDebounce';
import Paginate from '../../../components/Paginate';
import { useParamsQuery } from '../../../utils/helpers';

export default function FormEntries({ formId }) {
  const limit = 50;
  const path = useParamsQuery();
  const page = path.get('page');
  const pageNumber = Number(page);
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const { data, error, loading } = useQuery(FormEntriesQuery, {
      variables : {formId, query: debouncedValue, limit, offset: pageNumber }
  })
  const entriesHeaders = [
    { title: 'Date of Submission', col: 1 },
    { title: 'Submitted by', col: 1 },
    { title: 'Status', col: 1 }
  ];

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return;
      history.push(`/form/${formId}/${data?.formEntries?.formName}/entries?page=${pageNumber - limit}`);
    } else if (action === 'next' && data?.formEntries?.formUsers?.length) {
      if (data?.formEntries?.formUsers?.length < limit) return;
      history.push(`/form/${formId}/${data?.formEntries?.formName}/entries?page=${pageNumber + limit}`);
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />


  return (

    <div>
      <div style={{marginLeft: '10px'}}>
        <Typography variant="h6" gutterBottom>
          {data?.formEntries?.formName}
        </Typography>
        <div style={{marginBottom: '20px'}}>
          <SearchInput
            title="Entries"
            searchValue={searchValue}
            filterRequired={false}
            handleSearch={event => setSearchValue(event.target.value)}
            handleClear={() => setSearchValue('')}
          />
        </div>
      </div>
      <ListHeader headers={entriesHeaders} />
      {
            data?.formEntries?.formUsers?.length > 0 ? data?.formEntries?.formUsers?.map(formUser => (
              <DataList
                key={formUser.id}
                keys={entriesHeaders}
                data={renderFormEntry(formUser)}
                hasHeader={false}
                clickable
                handleClick={() => history.push(`/user_form/${formUser.formId}/${formUser.userId}/${data?.formEntries?.formName}`)}
              />
            )) : (
              <CenteredContent>No Entries Available</CenteredContent>
            )
        }
      <CenteredContent>
        <Paginate
          offSet={pageNumber}
          limit={limit}
          active={pageNumber >= 1}
          handlePageChange={paginate}
          count={data?.formEntries?.formUsers?.length}
        />
      </CenteredContent>
    </div>
    )
}

export function renderFormEntry(formUser) {
  return [
    {
      'Date of Submission': (
        <Grid item xs={12} md={2} data-testid="submitted_on">
          <Text content={dateToString(formUser.createdAt)} />
        </Grid>
      ),
      'Submitted by': (
        <Grid item xs={12} md={2} data-testid="submitted_by">
          <div style={{ display: 'flex' }}>
            <Avatar src={formUser.user.imageUrl} alt="avatar-image" />
            <Typography color="primary" style={{ margin: '7px', fontSize: '12px' }}>
              {formUser.user.name}
            </Typography>
          </div>
        </Grid>
      ),
      'Status': (
        <Grid item xs={12} md={2} data-testid="status">
          <Text content={formUser.status} />
        </Grid>
      )
    }
  ];
}

FormEntries.propTypes = {
  formId: PropTypes.string.isRequired
}


