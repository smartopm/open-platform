import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import RouteData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import FormBuilderPage from '../../containers/FormBuilderPage';

jest.mock('react-markdown', () => <div />);
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('FormBuilderPage Component', () => {
  const mockParams = {
    formId: '123',
  }
  beforeEach(() => {
    jest.spyOn(RouteData, 'useParams').mockReturnValue(mockParams)
  });
  it('renders FormBuilder text', async () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <FormBuilderPage />
        </MemoryRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(screen.queryByTestId('loader')).toBeInTheDocument())
  });
});
