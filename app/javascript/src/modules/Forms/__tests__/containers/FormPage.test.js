import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RouteData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import FormPage from '../../containers/FormPage';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('react-markdown', () => <div />);
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('FormPage Component', () => {
  const mockParams = {
    formId: '123'
  };
  beforeEach(() => {
    jest.spyOn(RouteData, 'useParams').mockReturnValue(mockParams);
  });
  it('renders loader when loading form', async () => {
    const container = render(
      <MockedProvider>
        <MemoryRouter>
          <MockedThemeProvider>
            <FormPage />
          </MockedThemeProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();
    });
  });
});
