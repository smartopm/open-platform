import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import EmailDetailsDialog from '../components/EmailDetailsDialog';

describe('Email Details Dialog', () => {
  const props = {
    open: true,
    loading: false,
    handleClose: jest.fn(),
    handleSave: jest.fn()
  };
  it('should render properly', () => {
    const container = render(<EmailDetailsDialog {...props} />);
    expect(container.queryByText('Add Email Details')).toBeInTheDocument();
    expect(container.queryByText('form_fields.template_name')).toBeInTheDocument();
    expect(container.queryByText('form_fields.template_subject')).toBeInTheDocument();
    expect(container.queryByText('form_actions.cancel')).toBeInTheDocument();
    expect(container.queryByText('form_actions.save')).toBeInTheDocument();
    expect(container.queryByText('form_actions.save')).not.toBeDisabled();

    fireEvent.click(container.queryByTestId('save_btn'));
    expect(props.handleSave).toBeCalled();

    fireEvent.click(container.queryByTestId('cancel_btn'));
    expect(props.handleClose).toBeCalled();
  });
});
