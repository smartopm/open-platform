import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UserFilledForms from '../Components/UserFilledForms';
import { FormsQuery } from '../../Forms/graphql/forms_queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';

describe('UserFilledForms component', () => {
  const mocks = {
    request: {
      query: FormsQuery,
      variables: { userId: '3954jefsdfs' }
    },
    result: {
      data: {
        forms: [
          {
            id: 'caea7b44-ee95-42a6',
            name: 'Lease Form',
            expiresAt: '2020-12-31T23:59:59Z',
            createdAt: '2020-10-07T09:37:03Z',
            roles: ['client']
          },
          {
            id: '3e530432172e',
            name: 'Another Form',
            expiresAt: '2020-12-31T23:59:59Z',
            createdAt: '2020-10-07T09:37:03Z',
            roles: ['admin', 'resident']
          }
        ]
      }
    }
  };

  it('should render a list of forms filled by the user', async () => {
    const userFormsFilled = [
      {
        id: '1',
        form: {
          name: 'Form One',
          id: '34243242'
        },
        createdAt: '2020-10-10',
        commentsCount: 2
      }
    ];

    const rendered = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <Context.Provider value={userMock}>
          <UserFilledForms
            userFormsFilled={userFormsFilled}
            userId="3954jefsdfs"
            currentUser="9238492318921"
          />
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
    const rendered = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <Context.Provider value={userMock}>
          <UserFilledForms userFormsFilled={[]} userId="3954jefsdfs" currentUser="9238492318921" />
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(rendered.queryByText('misc.no_forms')).toBeInTheDocument();
      expect(rendered.queryByTestId('form_item')).not.toBeInTheDocument();
    });
  });
});
