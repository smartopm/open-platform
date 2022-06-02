import React from 'react';
import { render } from '@testing-library/react';

import MenuList from "../MenuList";

describe('MenuList', () => {
  it('should render the menu properly', () => {
    const menuData = {
      list: [
        { content: 'Example', isAdmin: true, color: '', handleClick: jest.fn() },
        { content: 'Another', isAdmin: true, color: '', handleClick: jest.fn() },
        { content: 'Menu', isAdmin: true, color: '', handleClick: jest.fn() },
        { content: 'LastOne', isAdmin: true, color: '', handleClick: jest.fn() }
      ],
      anchorEl: document.createElement("button"),
      open: true,
      userType: 'admin',
      handleClose: jest.fn()
    };

    const container = render(<MenuList {...menuData} />);
    expect(container.queryByTestId('menu_list').children).toHaveLength(4);
    expect(container.queryByText('Example')).toBeInTheDocument();
    expect(container.queryByText('Example')).not.toBeDisabled();
    expect(container.queryByText('Menu')).toBeInTheDocument();
    expect(container.queryByText('Menu')).not.toBeDisabled();
    expect(container.queryByText('LastOne')).toBeInTheDocument();
    expect(container.queryByText('LastOne')).not.toBeDisabled();
    expect(container.queryByText('Another')).not.toBeDisabled();
    expect(container.queryByText('Another')).toBeInTheDocument();
  });
});
