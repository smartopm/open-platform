import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import UserFilledForms from '../Components/UserFilledForms';
import { FormsQuery } from '../../Forms/graphql/forms_queries';
import { SubmittedFormsQuery } from '../../Forms/UserForms/graphql/userform_queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('UserFilledForms component', () => {
  const mockData = {
    request: {
      query: FormsQuery,
      variables: { userId: '09077f53-4ee1-4416-b76a-9bd27f6104e1' }
    },
    result: {
      data: {
        forms: [
          {
            id: 'caea7b44-ee95-42a6',
            name: 'Lease Form',
            expiresAt: '2020-12-31T23:59:59Z',
            createdAt: '2020-10-07T09:37:03Z',
            isPublic: false,
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
  };

  it('should render a list of forms filled by the user', async () => {
    const submittedFormsMock = {
      request: {
        query: SubmittedFormsQuery,
        variables: { userId: '09077f53-4ee1-4416-b76a-9bd27f6104e1' }
      },
      result: {
        data: {
          submittedForms: [
            {
              id: '1',
              form: {
                name: 'Form One',
                id: '34243242'
              },
              status: 'pending',
              userId: '09077f53-4ee1-4416-b76a-9bd27f6104e1',
              createdAt: '2020-10-10',
              commentsCount: 2,
            }
          ]
        }
      }
    };

    const rendered = render(
      <MockedProvider mocks={[mockData, submittedFormsMock]} addTypename={false}>
        <Context.Provider value={userMock}>
          <BrowserRouter>
            <MockedThemeProvider>
              <UserFilledForms
                userId="09077f53-4ee1-4416-b76a-9bd27f6104e1"
                currentUser="9238492318921"
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(rendered.queryByText('Form One')).toBeInTheDocument();
      expect(rendered.queryByText('2020-10-10')).toBeInTheDocument();
      expect(rendered.queryByText('common:menu.submit_form')).toBeInTheDocument();
    });
  });
  it('should not contain form list when list is empty', async () => {
    const submittedFormsMock = {
      request: {
        query: SubmittedFormsQuery,
        variables: { userId: '09077f53-4ee1-4416-b76a-9bd27f6104e1' }
      },
      result: {
        data: {
          submittedForms: []
        }
      }
    };
    
    const rendered = render(
      <MockedProvider mocks={[mockData, submittedFormsMock]} addTypename={false}>
        <Context.Provider value={userMock}>
          <BrowserRouter>
            <MockedThemeProvider>
              <UserFilledForms
                userId="09077f53-4ee1-4416-b76a-9bd27f6104e1"
                currentUser="9238492318921"
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(rendered.queryByText('misc.no_forms')).toBeInTheDocument();
      expect(rendered.queryByTestId('form_item')).not.toBeInTheDocument();
    });
  });
});
