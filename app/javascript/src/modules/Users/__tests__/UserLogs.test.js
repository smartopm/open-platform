import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import UserLogs from '../Containers/UserLogs';
import { AllEventLogsForUserQuery } from '../../../graphql/queries'

describe('UserLogs', () => {
  const props = {
    history: {},
    match: { params: { id: '5gh673' } }
  };

  const mock = {
    request: {
      query: AllEventLogsForUserQuery,
      variables: { subject: null, userId: "5gh673" }
    },
    result: {
      id: '1234'
    }
  };

  it('should render the component', () => {
    render(
      <MockedProvider mock={[mock]}>
        <BrowserRouter>
          <UserLogs {...props} />
        </BrowserRouter>
      </MockedProvider>
    );
    // expect(getByText('I am testing this again')).toBeInTheDocument()
  });
});
