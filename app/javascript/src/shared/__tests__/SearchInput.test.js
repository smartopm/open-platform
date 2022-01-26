import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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
      />
    );
    expect(container.queryAllByText('search.search_for')[0]).toBeInTheDocument();
    expect(container.queryAllByText('search.search_for')).toHaveLength(2);
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
  })
});
