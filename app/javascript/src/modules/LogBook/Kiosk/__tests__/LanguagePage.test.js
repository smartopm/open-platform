import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import LanguagePage from '../components/LanguagePage';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    };
  }
}));

describe('Language Page', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
    Object.defineProperty(window, 'performance', {
      value: {
        getEntriesByType: jest.fn().mockReturnValue([{ type: 'navigation' }]),
        measure: jest.fn()
      }
    });
  });

  it('should check if the page renders properly', () => {
    const wrapper = render(
      <MemoryRouter>
        <Context.Provider value={authState}>
          <LanguagePage />
        </Context.Provider>
      </MemoryRouter>
    );

    expect(wrapper.queryByTestId('community_logo')).toBeInTheDocument();
    expect(wrapper.queryByAltText('community logo')).toBeInTheDocument();
    expect(wrapper.queryByTestId('select_kiosk_language')).toBeInTheDocument();
    expect(wrapper.queryByTestId('English_kiosk_lang_btn')).toBeInTheDocument();
    expect(wrapper.queryByTestId('Español_kiosk_lang_btn')).toBeInTheDocument();
    expect(wrapper.queryByTestId('exit_btn')).toBeInTheDocument();

    fireEvent.click(wrapper.queryByTestId('English_kiosk_lang_btn'));
    expect(mockHistory.push).toBeCalled()
    expect(mockHistory.push).toBeCalledWith('/logbook/kiosk/index')

    fireEvent.click(wrapper.queryByTestId('Español_kiosk_lang_btn'));
    expect(mockHistory.push).toBeCalled();
    expect(mockHistory.push).toBeCalledWith('/logbook/kiosk/index');

    fireEvent.click(wrapper.queryByTestId('exit_btn'));
    expect(mockHistory.push).toBeCalled();
    expect(mockHistory.push).toBeCalledWith('/');
  });

  it('should confirm the absence of the exit button for non-admin', () => {
    const wrapper = render(
      <MemoryRouter>
        <Context.Provider value={{ ...authState, user: { userType: 'site_worker' } }}>
          <LanguagePage />
        </Context.Provider>
      </MemoryRouter>
    );

    expect(wrapper.queryByTestId('exit_btn')).not.toBeInTheDocument();
  });
});
