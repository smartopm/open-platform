import React from 'react';
import { render } from '@testing-library/react';
import CustomDialog from "../../dialogs/CustomDialog";


describe('Custom Dialog', () => {
  it('should render a custom dialog', () => {
    const props = {
      open: true,
      handleDialogStatus: jest.fn(),
      actions: <h5>This is an action button</h5>,
      title: 'Add another user'
    };
    const dialogContainer = render(
      <CustomDialog {...props}>
        <h4>Child components</h4>
      </CustomDialog>
    );

    expect(dialogContainer.getByTestId('custom-dialog')).toBeInTheDocument();
    expect(dialogContainer.getByTestId('custom-dialog-title')).toBeInTheDocument();
    expect(dialogContainer.getByTestId('custom-dialog-close-icon')).toBeInTheDocument();
    expect(dialogContainer.getByText('Child components')).toBeInTheDocument();
    expect(dialogContainer.getByText('This is an action button')).toBeInTheDocument();
    expect(dialogContainer.getByText('Add another user')).toBeInTheDocument();
  });
});
