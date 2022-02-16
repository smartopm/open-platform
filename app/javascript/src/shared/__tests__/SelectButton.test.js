import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SelectButon from "../buttons/SelectButton";

describe('Select Button component', () => {
  const options = {
    sample1: 'Sample1',
    sample2: 'sample2'
  };
  it('should render correctly', () => {
    const container = render(
      <SelectButon
        buttonText="some text"
        open
        anchorRef={null}
        anchorEl='<div />'
        handleClose={jest.fn()}
        options={options}
        selectedKey="sample1"
        handleMenuItemClick={jest.fn()}
        handleClick={jest.fn()}
      />
    );
    expect(container.queryByTestId('button')).toBeInTheDocument();
    expect(container.queryByTestId('list')).toBeInTheDocument();
  });
});
