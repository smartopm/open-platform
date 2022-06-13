import React from 'react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import DataTable from '../Components/DataTable';
import MockedThemeProvider from "../../__mocks__/mock_theme";


describe('test the datatabe', () => {
  const dataProps = {
    columns: ['Name', 'Code'],
    sticky: true
  };
  it('should render', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <DataTable {...dataProps} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('data_table_container')).toBeInTheDocument();
    expect(container.queryByText('Name')).toBeInTheDocument();
    expect(container.queryByText('Code')).toBeInTheDocument();
  });
});
