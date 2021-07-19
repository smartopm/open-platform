import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import FormLinks from '../../containers/FormLinks';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import userMock from '../../../../__mocks__/userMock'
import { Context } from '../../../../containers/Provider/AuthStateProvider';

describe('FormLinks Component', () => {
  it('renders FormLinks text', () => {
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
  });
});
