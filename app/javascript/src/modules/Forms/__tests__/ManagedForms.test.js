import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import RoutesInfo, { RenderCommunityForms } from '../ManageForms';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import t from '../../__mocks__/t';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Forms List', () => {
  it('renders form list properly', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedThemeProvider>
          <BrowserRouter>
            <MockedProvider>
              <RenderCommunityForms />
            </MockedProvider>
          </BrowserRouter>
        </MockedThemeProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(container.queryByText('common:misc.forms')).toBeInTheDocument();
    }, 10);
  });
  it('exports necessary info', () => {
    expect(RoutesInfo.routeProps.path).toBe('/forms');
    expect(RoutesInfo.name(t)).toBe('menu.manage_forms');
  });
});
