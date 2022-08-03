import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import LanguageToggle from '../Components/LanguageToggle';

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

describe('Language Toggle Component', () => {
  it('should render without crashing', () => {
    const wrapper = render(<LanguageToggle />);
    expect(wrapper.queryByTestId('language_toggle')).toBeInTheDocument();
    expect(wrapper.queryByText('English')).toBeInTheDocument();

    fireEvent.change(wrapper.queryByTestId('language_toggle'), { target: { value: 'es-ES' } });

    expect(wrapper.queryByTestId('language_toggle').value).toBe('es-ES');
  });
});
