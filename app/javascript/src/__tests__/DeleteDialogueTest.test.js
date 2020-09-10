/* eslint-disable */
import React from 'react'
import {
    render
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import DeleteDialogue from "../components/Business/BusinessDeleteDialogue"
describe('It should render the dialog box for delete', () => {
    
    const container = render(
        <DeleteDialogue
            open={true}
            handleClose={jest.fn()}
            handleDelete={jest.fn()}
        />
    )
    it('It should render with dialog', () => {
      expect(container.queryByText('Delete Business')).toBeInTheDocument()
    });
});
