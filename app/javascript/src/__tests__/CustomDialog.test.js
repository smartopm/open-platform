import React from 'react'
import {
    render
} from '@testing-library/react'

import { CustomizedDialogs } from "../components/Dialog"

describe('It should render the dialog for user search', () => {
    
    const container = render(
      <CustomizedDialogs
        open={false}
        saveAction="Save"
        handleBatchFilter={jest.fn()}
        handleModal={jest.fn()}
        dialogHeader="Filter"
      >
        Test Dialogue
      </CustomizedDialogs>
    )
    it('should render with dialog', () => {
        expect(container.queryByTestId('custom-dialog-button')).toBeNull()
    });
});
