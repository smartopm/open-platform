import React from 'react';
import { render } from '@testing-library/react';

import SearchInput from "../search/SearchInput";

describe('Search Input component', () => {
  it('should render correctly', () => {
    const onChange = jest.fn();
    const container = render(
      <SearchInput
        title="Some searchable title"
        searchValue=""
        handleSearch={onChange}
        handleFilter={() => {}}
        filters={['some', 'some']}
        filterRequired={false}
      />
    );
    expect(container.queryAllByText('search.search_for')[0]).toBeInTheDocument();
    expect(container.queryAllByText('search.search_for')).toHaveLength(2);
    expect(container.queryByTestId('clear_filters_btn').textContent).toContain('search.clear_filters');
    expect(container.queryByTestId('search_results').textContent).toContain('search.search_results');
    expect(container.queryByTestId('filters_list').textContent).toContain('some');
    expect(container.queryByTestId('filter')).not.toBeInTheDocument();
  });
  it('should include a clear search query icon', () => {
    const onChange = jest.fn();
    const searchContainer = render(
      <SearchInput
        title="Some searchable title"
        searchValue="query"
        handleSearch={onChange}
        handleFilter={() => {}}
        handleClear={() => {}}
      />
    );
    expect(searchContainer.queryByTestId('clear_search')).toBeInTheDocument();
    expect(searchContainer.queryByTestId('clear_search')).not.toBeDisabled();
    expect(searchContainer.queryByTestId('filter')).toBeInTheDocument();
  })
});
