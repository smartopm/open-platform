import React from 'react';
import { act, render, waitFor  } from '@testing-library/react';

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
        name: 'Nkwashi',
        supportName: "Support Officer"
      }
    }
  };

  it('should enders the support page correctly', async () => {
    let container;
    await(act(async () => {
      container = render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider>
              <BrowserRouter>
                <Support />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
      )
    }))

    await waitFor(() => {
      expect(container.queryByText('misc.sales_support')).toBeInTheDocument()
    }, 50);
  });
});
