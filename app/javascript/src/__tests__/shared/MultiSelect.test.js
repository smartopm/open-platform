import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MultiSelect from '../../shared/MultiSelect';

describe('MultiSelect component', () => {
  it('should render properly', () => {
    const props = {
      labelName: 'Display on',
      options: ['Menu', 'Dashboard'],
      selectedOptions: ['Menu'],
      handleOnChange: () => {},
      fieldName: 'display_on',
    };

    const wrapper = render(<MultiSelect {...props} />);
    expect(wrapper.queryAllByText('Display on')[0]).toBeInTheDocument();
  });
});
