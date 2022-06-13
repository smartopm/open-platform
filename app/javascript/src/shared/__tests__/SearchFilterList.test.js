import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import SearchFilterList from '../search/SearchFilterList';

describe('SearchFilterList', () => {
  it('should render properly', () => {
    const filters = ['all', 'somethingelse'];
    const clearFilters = jest.fn();
    const container = render(
      <SearchFilterList filters={filters} handleClearFilters={clearFilters} isSmall={false} />
    );
    expect(container.queryByTestId('clear_filters_btn').textContent).toContain('search.clear_filters');
    expect(container.queryByTestId('search_results').textContent).toContain('search.search_results');
    expect(container.queryByTestId('filters_list').textContent).toContain('somethingelse');

    fireEvent.click(container.queryByTestId('clear_filters_btn'));

    expect(clearFilters).toBeCalled()
  });

  it('should not render the filter list when no filters', () => {
    const clearFilters = jest.fn();
    const container = render(
      <SearchFilterList filters={[]} handleClearFilters={clearFilters} isSmall={false} />
    );
    expect(container.queryByTestId('clear_filters_btn')).not.toBeInTheDocument()
  })
});
