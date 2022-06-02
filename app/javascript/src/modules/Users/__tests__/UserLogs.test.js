import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import ReactRouter from 'react-router'
import UserLogs, { AllEventLogs } from '../Containers/UserLogs';
import { AllEventLogsForUserQuery } from '../../../graphql/queries';

describe('UserLogs', () => {
  jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: '5gh673' });
  const props = {
    history: {},
    subjects: null
  };
  const logsMock = {
    request: {
      query: AllEventLogsForUserQuery,
      variables: { subject: null, userId: '5gh673', offset: 0, limit: 50 },
    },
    result: {
      data: {
        result: [
          {
            id: '1212938123asd2e34',
            sentence: "I am testing this again",
            actingUser: {
              name: "Some Name",
              id: '5gh673'
            },
            refType: "",
            subject: '',
            refId: '9238492dasd',
            data: {},
            createdAt: '2020-09-10'
  
          }
        ]
      }
    }
  };

  it('should render the component', async () => {
    render(
      <MockedProvider mocks={[logsMock]} addTypename={false}>
        <BrowserRouter>
          <UserLogs />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('2020-09-10')).toBeInTheDocument()
    },20)
  });
  it('should render the component with the right data', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[logsMock]} addTypename={false}>
        <BrowserRouter>
          <AllEventLogs {...props} />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('I am testing this again')).toBeInTheDocument()
    },20)
  });
});
