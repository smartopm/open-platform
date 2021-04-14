import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DeleteDialogue from "../components/Business/DeleteDialogue"

describe('It should render the dialog box for delete', () => {
    it('It should render with dialog', () => {
      const container = render(
        <DeleteDialogue
          open
          handleClose={jest.fn()}
          handleDelete={jest.fn()}
          title="business"
          handleAction={jest.fn}
          loading={false}
        />
      )
      expect(container.queryByText('Are you sure you want to delete this business?')).toBeInTheDocument()
      expect(container.queryByTestId('confirm_action')).toBeInTheDocument()
    });
    it('It should render loader when confirm action is clicked', () => {
      const container = render(
        <DeleteDialogue
          open
          handleClose={jest.fn()}
          handleDelete={jest.fn()}
          title="business"
          handleAction={jest.fn}
          loading
        />
      )
      expect(container.queryByText('Are you sure you want to delete this business?')).toBeInTheDocument()
      expect(container.queryByTestId('confirm_action')).toBeNull()
    });
});
