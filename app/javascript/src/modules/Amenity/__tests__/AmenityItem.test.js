import { render } from '@testing-library/react';
import React from 'react';
import AmenityItem from '../Components/AmenityItem';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Amenity Item', () => {
  it('should render the amenity item component', () => {
    const amenity = {
      name: 'Example ',
      description: 'This is more details',
      location: '20st North',
      hours: '2pm',
      invitationLink: ''
    };

    const wrapper = render(
      <MockedThemeProvider>
        <AmenityItem amenity={amenity} />
      </MockedThemeProvider>
    );
    expect(wrapper.queryByTestId('amenity_description')).toBeInTheDocument();
    expect(wrapper.queryByTestId('amenity_description').textContent).toContain(
      'This is more details'
    );
    expect(wrapper.queryByTestId('amenity_location').textContent).toContain('20st North');
    expect(wrapper.queryByTestId('amenity_hours').textContent).toContain('2pm');
  });
});
