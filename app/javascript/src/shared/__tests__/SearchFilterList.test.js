import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import SearchFilterList from '../search/SearchFilterList';

describe('SearchFilterList', () => {
  it('should render properly', () => {
    const filters = ['all', 'somethingelse'];
    const clearFilters = jest.fn();
    const container = render(
      <SearchFilterList
        filters={filters}
        handleClearFilters={clearFilters}
        isSmall={false}
        count={{ status: true, value: 10 }}
      />
    );
    expect(container.queryByTestId('clear_filters_btn').textContent).toContain('search.clear');
    expect(container.queryByTestId('search_results').textContent).toContain('search.search_results');
    expect(container.queryByTestId('filters_list').textContent).toContain('somethingelse');
    expect(container.getByText(/10/)).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('clear_filters_btn'));

    expect(clearFilters).toBeCalled()
  });

  it('should not render the filter list when no filters', () => {
    const clearFilters = jest.fn();
    const container = render(
      <SearchFilterList filters={[]} handleClearFilters={clearFilters} isSmall={false} />
    );
    expect(container.queryByTestId('clear_filters_btn')).not.toBeInTheDocument()
  });

  it('should render loading component', () => {
    const filters = ['all', 'none'];
    const clearFilters = jest.fn();
    const container = render(
      <SearchFilterList
        filters={filters}
        handleClearFilters={clearFilters}
        isSmall={false}
        count={{status: true, value: 10}}
        loading
      />
    );
    expect(container.queryByTestId('filters_list').textContent).toContain('none');
    expect(container.queryByText(/10/)).not.toBeInTheDocument();
    expect(container.queryByTestId('loader')).toBeInTheDocument();

  });
});
