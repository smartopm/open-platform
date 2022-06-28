import React from 'react';
import { render, waitFor } from '@testing-library/react';

import RouteData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import FormPage from '../../containers/FormPage';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { FormQuery } from '../../graphql/forms_queries';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';

jest.mock('react-markdown', () => <div />);
jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('FormPage Component', () => {
  const mockParams = {
    formId: '123'
  };
  beforeEach(() => {
    jest.spyOn(RouteData, 'useParams').mockReturnValue(mockParams);
  });

  const formMock = {
    request: {
      query: FormQuery,
      variables: { id: mockParams.formId },
    },
    result: {
      data: {
        form: {
          id: '7d05e98e-e6bb-43cb-838e-e6d76005e326',
          name: 'Another Registry V2',
          preview: true,
          isPublic: false,
          description: 'This is a customs form',
          expiresAt: '2021-12-31T23:59:59Z',
          multipleSubmissionsAllowed: true,
          hasTermsAndConditions: false,
          roles: [],
        },
      },
    },
  };
  it('renders loader when loading form', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[formMock]} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <FormPage />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByTestId('save_as_draft')).toBeInTheDocument();
      expect(container.queryByTestId('submit_form_btn')).toBeInTheDocument();
    }, 10);
  });

  it('renders breadcrumb when loading form for non public users', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[formMock]} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <FormPage />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.queryByText('common:misc.forms')).toBeInTheDocument();
      expect(container.queryByTestId('page_name')).toBeInTheDocument();
      expect(container.queryByTestId('page_title')).toBeInTheDocument();
    });
  });

  it('does not render breadcrumb when loading form for public users', async () => {
    authState.user.userType = 'public_user'
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[formMock]} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <FormPage />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.queryByText('common:misc.forms')).not.toBeInTheDocument();
      expect(container.queryByTestId('page_name')).not.toBeInTheDocument();
      expect(container.queryByTestId('page_title')).not.toBeInTheDocument();
    });
  });
});
