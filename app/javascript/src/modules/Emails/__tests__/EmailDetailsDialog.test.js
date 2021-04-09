import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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
    expect(container.queryByText('Template Name')).toBeInTheDocument();
    expect(container.queryByText('Template Subject')).toBeInTheDocument();
    expect(container.queryByText('Cancel')).toBeInTheDocument();
    expect(container.queryByText('Save Changes')).toBeInTheDocument();
    expect(container.queryByText('Save Changes')).not.toBeDisabled();

    fireEvent.click(container.queryByTestId('save_btn'));
    expect(props.handleSave).toBeCalled();

    fireEvent.click(container.queryByTestId('cancel_btn'));
    expect(props.handleClose).toBeCalled();
  });
});
