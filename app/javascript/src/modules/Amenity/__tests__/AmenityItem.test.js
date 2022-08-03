import { fireEvent, render } from '@testing-library/react';
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
      invitationLink: 'http://link'
    };
    window.open = jest.fn()
    const handleEdit = jest.fn()
    const wrapper = render(
      <MockedThemeProvider>
        <AmenityItem
          amenity={amenity}
          translate={jest.fn()}
          handleEditAmenity={handleEdit}
          hasAccessToMenu
        />
      </MockedThemeProvider>
    );
    expect(wrapper.queryByTestId('amenity_description')).toBeInTheDocument();
    expect(wrapper.queryByTestId('amenity_description').textContent).toContain(
      'This is more details'
    );
    expect(wrapper.queryByTestId('amenity_location').textContent).toContain('20st North');
    expect(wrapper.queryByTestId('amenity_hours').textContent).toContain('2pm');
    expect(wrapper.queryByTestId('button')).toBeInTheDocument();

    expect(wrapper.queryByTestId('discussion-menu')).toBeInTheDocument();

    fireEvent.click(wrapper.queryByTestId('discussion-menu'));

    // click the edit menu item
    fireEvent.click(wrapper.queryAllByTestId('menu_item')[0]);
    expect(handleEdit).toHaveBeenCalled();
    expect(handleEdit).toHaveBeenCalledWith(amenity, 'edit');

    // click the delete menu item
    fireEvent.click(wrapper.queryAllByTestId('menu_item')[1]);
    expect(handleEdit).toHaveBeenCalled();
    expect(handleEdit).toHaveBeenCalledWith(amenity, 'delete');

    fireEvent.click(wrapper.queryByTestId('button'));
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(window.open).toHaveBeenCalled();
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(window.open).toHaveBeenCalledWith('http://link', '_blank');

  });
});
