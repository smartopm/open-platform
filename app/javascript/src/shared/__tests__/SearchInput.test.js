import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import SearchInput from "../search/SearchInput";

describe('Search Input component', () => {
  const options = [
    { title: 'menu_one', value: 'menu one' },
    { title: 'menu_two', value: 'menu two' },
  ];

  const props = {
    title: 'Some searchable title',
    searchValue: 'query',
    handleSearch: jest.fn(),
    handleFilter: jest.fn(),
    handleClear: jest.fn(),
  };

  it('should render correctly', () => {
    const newProps = {...props, searchValue: '', filters: ["some", "some"], filterRequired: false }
    const container = render(
      <SearchInput {...newProps} />
    );

    expect(container.queryAllByText('search:search.search_for')[0]).toBeInTheDocument();
    expect(container.queryAllByText('search:search.search_for')).toHaveLength(2);
    expect(container.queryByTestId('clear_filters_btn').textContent).toContain('search.clear_filters');
    expect(container.queryByTestId('search_results').textContent).toContain('search.search_results');
    expect(container.queryByTestId('filters_list').textContent).toContain('some');
    expect(container.queryByTestId('filter')).not.toBeInTheDocument();

    fireEvent.click(container.getByTestId('clear_filters_btn'));
    expect(props.handleClear).toHaveBeenCalled();
  });
  it('should include a clear search query icon', () => {
    const searchContainer = render(
      <SearchInput {...props} />
    );
    expect(searchContainer.queryByTestId('clear_search')).toBeInTheDocument();
    expect(searchContainer.queryByTestId('clear_search')).not.toBeDisabled();
    expect(searchContainer.queryByTestId('filter')).toBeInTheDocument();
  })

  it('should render filer menu list', async () => {
    const updatedProps = { ...props, filterMenu: true, filterOptions: options };
    const searchContainer = render(<SearchInput {...updatedProps} />);

    const filterIcon = searchContainer.queryByTestId('filter');
    expect(filterIcon).toBeInTheDocument();

    fireEvent.click(filterIcon);

    await waitFor(() => {
      expect(document.getElementById('composition-menu')).toBeInTheDocument();
      expect(searchContainer.queryByTestId('0-menu_one')).toBeInTheDocument();
      expect(searchContainer.queryByTestId('1-menu_two')).toBeInTheDocument();
      expect(searchContainer.queryByText('common:misc.show menu_one')).toBeInTheDocument();
      expect(searchContainer.queryByText('common:misc.show menu_two')).toBeInTheDocument();

      fireEvent.click(searchContainer.queryByTestId('0-menu_one'));
      expect(props.handleFilter).toBeCalled();
    })

  });
});
