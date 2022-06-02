import React from 'react';
import { render, screen } from '@testing-library/react';

import MultiSelect from "../MultiSelect";

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

  describe('Roles menu', () => {
    it('renders roles menu', () => {
      const props = {
        labelName: 'Select roles that can view this link',
        fieldName: 'roles',
        type: 'chip',
        options: ['admin', 'client', 'resident'],
        selectedOptions: ['admin'],
        handleOnChange: () => {}
      };

      render(<MultiSelect {...props} />);
      const rolesMenu = screen.getByLabelText('Select roles that can view this link');

      expect(rolesMenu).toBeInTheDocument();
    });

    it('renders selected roles', () => {
      const props = {
        labelName: 'Select roles that can view this link',
        fieldName: 'roles',
        type: 'chip',
        options: ['admin', 'client', 'resident'],
        selectedOptions: ['admin', 'client'],
        handleOnChange: () => {}
      };

      render(<MultiSelect {...props} />);
      const adminChip = screen.getByText(/admin/);
      const clientChip = screen.getByText(/client/);

      expect(adminChip).toBeInTheDocument();
      expect(clientChip).toBeInTheDocument();
    });
  });
});
