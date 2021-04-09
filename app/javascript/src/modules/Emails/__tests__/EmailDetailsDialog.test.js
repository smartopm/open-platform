import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmailDetailsDialog from '../components/EmailDetailsDialog';

describe('Email Details Dialog', () => {
  // arrange props
  // open, handleClose, handleSave, loading
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
  })
});
