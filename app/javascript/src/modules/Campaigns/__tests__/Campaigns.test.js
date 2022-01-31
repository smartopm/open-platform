import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Campaigns from '../containers/Campaigns';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Campaigns Component', () => {
  it('renders Campaigns text', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Campaigns />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
  });
});
