import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DeleteDialogue from "../components/Business/DeleteDialogue"

describe('It should render the dialog box for delete', () => {
    const container = render(
      <DeleteDialogue
        open
        handleClose={jest.fn()}
        handleDelete={jest.fn()}
        title="business"
        handleAction={jest.fn}
      />
    )
    it('It should render with dialog', () => {
      expect(container.queryByText('Delete Business')).toBeInTheDocument()
      expect(container.queryByText('Are you sure you want to delete this business ?')).toBeInTheDocument()
    });
});
