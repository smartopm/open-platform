import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import EmployeeLogs from '../Components/EmployeeLogs';

describe('EmployeeLogs Component', () => {
  it('renders loader when loading records', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <EmployeeLogs />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
