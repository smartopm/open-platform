import { validateThemeColor } from '../helpers';

describe('Helper utils for the community module', () => {
  it('should validate the theme color', () => {
    const validTheme = {
      primaryColor: '#69ABA4',
      secondaryColor: '#cf5628'
    };

    const invvalidTheme = {
      primaryColor: '#69ABA4',
      secondaryColor: 'cf5628'
    };
    expect(validateThemeColor(validTheme)).toBe(true);
    expect(validateThemeColor(invvalidTheme)).toBe(false);
  });
});
