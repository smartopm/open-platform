import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SelectButon from "../../buttons/SelectButton";

describe('should render Select Button component', () => {
  const options = [
    {
      key: 'sample_key',
      value: 'Sample Value',
      handleMenuItemClick: jest.fn(),
      show: true, 
      subMenu: [
        {
          key: 'sample_key_sub_menu',
          value: 'Sample Value Sub Menu',
          handleMenuItemClick: jest.fn(),
          show: true
        }
      ]
    }
  ];

  const handleClick = jest.fn()

  it('should render select menu item list', () => {
    const container = render(
      <SelectButon
        buttonText="some text"
        open
        handleClose={jest.fn()}
        options={options}
        selectedKey="sample_key"
        handleMenuItemClick={jest.fn()}
        handleClick={handleClick}
      />
    );
    expect(container.queryByTestId('button')).toBeInTheDocument();
    expect(container.queryByTestId('list')).toBeInTheDocument();
    expect(container.queryByText('some text')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('arrow-icon'))
    expect(handleClick).toHaveBeenCalled();
    expect(container.queryByText('Sample Value')).toBeInTheDocument();
    
    fireEvent.click(container.queryByText('Sample Value'))
    expect(container.queryByText('Sample Value Sub Menu')).toBeInTheDocument();
  });
});
