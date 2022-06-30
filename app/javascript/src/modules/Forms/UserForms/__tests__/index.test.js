import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import MyRoutesInfo, { RenderMyForms } from '..';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import t from '../../../__mocks__/t';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

describe('My Forms', () => {
  it('renders submitted forms properly', async () => {
    render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedProvider>
              <RenderMyForms />
            </MockedProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(MyRoutesInfo.routeProps.path).toBe('/myforms');
      expect(MyRoutesInfo.name(t)).toBe('menu.form');
    }, 10);
  });
});
