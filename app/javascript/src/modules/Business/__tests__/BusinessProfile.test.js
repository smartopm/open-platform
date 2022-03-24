/* eslint-disable security/detect-non-literal-fs-filename */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import Profile from '../Components/BusinessProfile';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('It tests the business profile page', () => {
  const props = {
    profileData: {
      category: 'construction',
      createdAt: '2020-06-30T15:54:34Z',
      homeUrl: 'https://google.com',
      name: 'Artist',
      email: 'a@b.com',
      phoneNumber: '23627378',
      userId: '4f1492a9-5451-4f0a-b35d-bc567e1e56b7',
      id: '43c596de-e07f-4d0f-a727-53fb4b8b44ce',
      description: 'description',
      address: 'home',
      status: 'verified'
    }
  };
  it('should check all profile properties', () => {
    window.open = jest.fn();
    let container;
    act(() => {
      container = render(
        <Context.Provider value={userMock}>
          <MockedProvider>
            <BrowserRouter>
              <MockedThemeProvider>
                <Profile {...props} />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    });
    expect(container.queryByTestId('details-holder').children).toHaveLength(6);
    expect(container.queryByTestId('pf-number').textContent).toContain('23627378');
    expect(container.queryByText(/a@b.com/).textContent).toContain('a@b.com');
    expect(container.queryByText('home').textContent).toContain('home');
    expect(container.queryByText('description').textContent).toContain('description');
    expect(container.queryAllByText('verified')[0].textContent).toContain('verified');
    expect(container.queryByText('https://google.com').textContent).toContain('https://google.com');
    expect(container.queryByTestId('inquire_btn').textContent).toContain(
      'business.ask_about_business'
    );

    fireEvent.click(container.queryByTestId('inquire_btn'));
    fireEvent.click(container.queryByTestId('home_url'));
    fireEvent.keyPress(container.queryByTestId('home_url'));

    expect(window.open).toBeCalledWith('https://google.com', '_blank');

    fireEvent.change(container.queryByTestId('business_tabs'), { value: 'Relevant Posts' });

    expect(container.queryByTestId('operating_hrs').textContent).toContain(
      'form_fields.operating_hours'
    );
  });
  it('should check for other props', () => {
    const otherProps = {
      profileData: {
        ...props.profileData,
        homeUrl: 'www.google.fr',
        description: null
      }
    };
    window.open = jest.fn();
    let container;

    act(() => {
      container = render(
        <Context.Provider value={userMock}>
          <MockedProvider>
            <BrowserRouter>
              <MockedThemeProvider>
                <Profile {...otherProps} />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    });

    fireEvent.click(container.queryByTestId('home_url'));
    expect(window.open).toBeCalledWith('http://www.google.fr', '_blank');
    expect(container.queryByTestId('pf-description').textContent).toContain('misc.no_description');
  });
});
