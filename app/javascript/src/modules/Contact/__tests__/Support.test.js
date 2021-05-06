import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import Support from '../Components/Support';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';

describe('Support main page', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'client',
      expiresAt: null,
      community: {
        supportName: "Support Officer"
      }
    }
  };
it('renders the support page correctly', () => {
    const container = render(
      <ApolloProvider client={createClient}>
        <Context.Provider value={data.user}>
          <MockedProvider>
            <BrowserRouter>
              <Support />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      </ApolloProvider>
    );
    expect(container.queryByText('Sales Support')).toBeInTheDocument()
  });
});
