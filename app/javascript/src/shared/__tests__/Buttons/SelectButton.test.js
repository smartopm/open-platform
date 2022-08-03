import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import SelectButon from "../../buttons/SelectButton";

describe('should render Select Button component', () => {

  const handleClick = jest.fn()

  it('should render select menu item with submenu list', () => {
    const options = [
      {
        key: 'sample_key',
        value: 'Sample Value',
        handleMenuItemClick: jest.fn(),
        name: 'Sample Name',
        show: true,
        subMenu: [
          {
            key: 'sample_key_sub_menu',
            value: 'Sample Value Sub Menu',
            name: 'Sample Name Sub Menu',
            handleMenuItemClick: jest.fn(),
            show: true
          }
        ]
      }
    ];
    const container = render(
      <SelectButon
        defaultButtonText="some text"
        open
        handleClose={jest.fn()}
        options={options}
        selectedKey="sample_key"
        handleMenuItemClick={jest.fn()}
        handleClick={handleClick}
        anchorEl={document.createElement("button")}
      />
    );
    expect(container.queryByTestId('button')).toBeInTheDocument();
    expect(container.queryByTestId('list')).toBeInTheDocument();
    expect(container.queryByText('some text')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('arrow-icon'))
    expect(handleClick).toHaveBeenCalled();
    expect(container.queryByText('Sample Name')).toBeInTheDocument();

    fireEvent.click(container.queryByText('Sample Name'))
    expect(container.queryByText('Sample Name Sub Menu')).toBeInTheDocument();
    fireEvent.click(container.queryByText('Sample Name Sub Menu'))
  });

  it('should render select menu item without submenu list', () => {
    const handleMenuItemClick = jest.fn()
    const options = [
      {
        key: 'sample_key',
        value: 'Sample Value',
        name: 'Sample Name',
        handleMenuItemClick,
        show: true,
      }
    ];
    const container = render(
      <SelectButon
        defaultButtonText="some text"
        open
        handleClose={jest.fn()}
        options={options}
        selectedKey="sample_key"
        handleMenuItemClick={jest.fn()}
        handleClick={handleClick}
        anchorEl={document.createElement("button")}
      />
    );

    expect(container.queryByText('Sample Name')).toBeInTheDocument();

    fireEvent.click(container.queryByText('Sample Name'))
    expect(handleMenuItemClick).toHaveBeenCalled();
  });
});
