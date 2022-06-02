import React from 'react'
import { render } from '@testing-library/react'

import DeleteDialogue from "../../dialogs/DeleteDialogue"
import { Spinner } from "../../Loading";

describe('It should render the dialog box for delete', () => {
    it('should render with dialog', () => {
      const container = render(
        <DeleteDialogue
          open
          handleClose={jest.fn()}
          handleDelete={jest.fn()}
          title="business"
          handleAction={jest.fn}
          loading={false}
          action="Delete"
        />
      )
      expect(container.queryByTestId('delete_dialog')).toBeInTheDocument()
      expect(container.queryByTestId('confirm_action')).toBeInTheDocument()
    });
    it('should render loader when confirm action is clicked', () => {
      const container = render(
        <DeleteDialogue
          open
          handleClose={jest.fn()}
          handleDelete={jest.fn()}
          title="business"
          handleAction={jest.fn}
          loading
          action="Delete"
        />
      )
      expect(container.queryByTestId('delete_dialog')).toBeInTheDocument()
      expect(container.queryByTestId('confirm_action')).toBeNull()
      const loader = render(<Spinner />);
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    });
});
