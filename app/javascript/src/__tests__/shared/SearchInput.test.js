import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchInput from '../../shared/search/SearchInput';

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
    expect(container.queryAllByText('Search for Some searchable title')[0]).toBeInTheDocument();
    expect(container.queryAllByText('Search for Some searchable title')).toHaveLength(2);
  });
});
