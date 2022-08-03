import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import FormLinks from '../../containers/FormLinks';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import userMock from '../../../../__mocks__/authstate'
import { Context } from '../../../../containers/Provider/AuthStateProvider';

describe('FormLinks Component', () => {
  it('renders FormLinks text', async () => {
    render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <FormLinks />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => expect(screen.queryByText('common:misc.forms')).toBeInTheDocument());
  });
});
