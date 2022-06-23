import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import RoutesInfo, { RenderAmenities } from '..';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import t from '../../__mocks__/t';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Amenity List', () => {
  it('renders amenity form properly', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedThemeProvider>
          <MockedProvider>
            <RenderAmenities />
          </MockedProvider>
        </MockedThemeProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(container.queryByText('common:misc.amenity_plural')).toBeInTheDocument();
    }, 10);
  });
  it('exports necessary info', () => {
    expect(RoutesInfo.routeProps.path).toBe('/amenities');
    expect(RoutesInfo.name(t)).toBe('misc.amenity');
  });
});
