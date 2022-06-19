import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import MyRoutesInfo, { RenderMyForms } from '..';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import t from '../../../__mocks__/t';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

describe('My Forms', () => {
  it('renders amenity form properly', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedThemeProvider>
          <MockedProvider>
            <RenderMyForms />
          </MockedProvider>
        </MockedThemeProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('my_form_title')).toBeInTheDocument();
    }, 10);
  });
  it('exports necessary info', () => {
    expect(MyRoutesInfo.routeProps.path).toBe('/myforms');
    expect(MyRoutesInfo.name(t)).toBe('menu.form');
  });
});
