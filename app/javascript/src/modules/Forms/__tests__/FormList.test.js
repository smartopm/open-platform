import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import routeData, { MemoryRouter } from 'react-router';

import { useTranslation } from 'react-i18next';
import FormLinkList from '../components/FormList';
import { FormsQuery } from '../graphql/forms_queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';

describe('Form List Component', () => {
  const { t } = useTranslation(['common', 'form']);
  const mocks = {
    request: {
      query: FormsQuery,
      variables: { userId: null }
    },
    result: {
      data: {
        forms: [
          {
            id: 'caea7b44-ee95-42a6',
            name: 'Lease Form',
            expiresAt: '2020-12-31T23:59:59Z',
            createdAt: '2020-10-07T09:37:03Z',
            roles: ['client'],
            isPublic: true
          },
          {
            id: '3e530432172e',
            name: 'Another Form',
            expiresAt: '2020-12-31T23:59:59Z',
            createdAt: '2020-10-07T09:37:03Z',
            roles: ['admin', 'resident'],
            isPublic: false
          }
        ]
      }
    }
  };

  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  it('should render form without error', async () => {
    // needs a theme provider to use theme related functions like theme.breakpoints
    const theme = createTheme();
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <Context.Provider value={userMock}>
          <MemoryRouter>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <FormLinkList
                  userType="admin"
                  community={userMock.user.community.name}
                  path="/forms"
                  t={t}
                />
              </ThemeProvider>
            </StyledEngineProvider>
          </MemoryRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();
    await waitFor(
      () => {
        expect(container.queryAllByTestId('community_form')).toHaveLength(2);
        expect(container.queryAllByTestId('community_form_icon')).toHaveLength(2);

        fireEvent.click(container.queryAllByTestId('community_form')[0]);
        expect(mockHistory.push).toBeCalledWith('/form/caea7b44-ee95-42a6/private');

        expect(container.queryAllByTestId('form_name')).toHaveLength(2);
        expect(container.queryAllByTestId('form_name')[0]).toHaveTextContent('Lease Form');
        expect(container.queryAllByTestId('form_name')[1]).toHaveTextContent('Another Form');

        fireEvent.click(container.queryByText('actions.create_a_form'));
        expect(mockHistory.push).toBeCalledWith('/forms/create');
      },
      { timeout: 5 }
    );
  });

  it('should render form without when id is present error', async () => {
    const theme = createTheme();
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <Context.Provider value={userMock}>
          <MemoryRouter>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <FormLinkList
                  userType="admin"
                  community={userMock.user.community.name}
                  path="/forms/create"
                  id="qedhgwewwefwfwf"
                  t={t}
                />
              </ThemeProvider>
            </StyledEngineProvider>
          </MemoryRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByText('common:misc.forms')).toBeInTheDocument();
    });
  });
});
