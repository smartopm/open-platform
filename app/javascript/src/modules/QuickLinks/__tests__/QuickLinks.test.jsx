import React from 'react';
import { screen, render } from '@testing-library/react';

import QuickLinks from '../Components/QuickLinks';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Quick Links', () => {
  const translate = jest.fn(() => 'Quick Links');
  it('renders quick links without error', () => {
    const menuItems = [
      {
        menu_link: 'https://example.com',
        menu_name: 'Quick Link 1'
      },
      {
        menu_link: 'https://example2.com',
        menu_name: 'Quick Link 2'
      }
    ];
    const container = render(
      <MockedThemeProvider>
        <QuickLinks menuItems={menuItems} translate={translate} />
      </MockedThemeProvider>
    );

    expect(container.queryAllByTestId('link-name')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('link-name')[0].textContent).toEqual('Quick Link 1');
  });

  it('does not render quick links when none exist', () => {
    const menuItems = [
      {
        menu_link: '',
        menu_name: ''
      }
    ];
    render(
      <MockedThemeProvider>
        <QuickLinks menuItems={menuItems} translate={translate} />
      </MockedThemeProvider>
    );
    const link = screen.queryByTestId('link-button');

    expect(link).not.toBeInTheDocument();
  });

  it('does not render when menuItems is not defined', () => {
    render(
      <MockedThemeProvider>
        <QuickLinks menuItems={[]} translate={translate} />
      </MockedThemeProvider>
    );
    const link = screen.queryByTestId('link-button');

    expect(link).not.toBeInTheDocument();
  });
});
