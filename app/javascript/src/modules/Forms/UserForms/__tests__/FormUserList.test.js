import { MockedProvider } from '@apollo/react-testing';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../__mocks__/authstate';
import FormUserList from '../Components/FormUserList';
import { FormsQuery } from '../../graphql/forms_queries';
import { SubmittedFormsQuery } from '../graphql/userform_queries';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

describe('FormUser Item', () => {
  const mocks = [
    {
      request: {
        query: SubmittedFormsQuery
      },
      result: {
        data: {
          submittedForms: [
            {
              id: 'e3ad6696-b6f5-4f4f-bfa2-b71f45fa9297',
              status: 'pending',
              createdAt: '2022-06-17T08:01:04-06:00',
              userId: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
              commentsCount: 3,
              form: {
                id: '97f21200-19dc-4843-a5fb-ff55b8367548',
                name: 'Another form'
              }
            }
          ]
        }
      }
    },
    {
      request: {
        query: FormsQuery,
        variables: { userId: '11cdad78' }
      },
      result: {
        data: {
          forms: [
            {
              id: 'caea7b44-ee95-42a6',
              name: 'Lease Form',
              isPublic: false,
              expiresAt: '2020-12-31T23:59:59Z',
              createdAt: '2020-10-07T09:37:03Z',
              roles: ['client']
            },
            {
              id: '3e530432172e',
              name: 'Another Form',
              expiresAt: '2020-12-31T23:59:59Z',
              isPublic: false,
              createdAt: '2020-10-07T09:37:03Z',
              roles: ['admin', 'resident']
            }
          ]
        }
      }
    }
  ];
  it('should render with no errors', async () => {
    const wrapper = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <FormUserList />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(wrapper.queryByTestId('form_user_item')).toBeInTheDocument();
      expect(wrapper.queryByTestId('disc_title')).toBeInTheDocument();
    }, 20);
  });
  it('should render loader before fetching data', async () => {
    const wrapper = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <FormUserList />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(wrapper.queryByTestId('loader')).toBeInTheDocument();
  });
});
