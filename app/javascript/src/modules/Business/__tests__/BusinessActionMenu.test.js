import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import BusinessActionMenu from '../Components/BusinessActionMenu'
import { DeleteBusiness } from '../graphql/business_mutations'
import authState from '../../../__mocks__/authstate';

describe('business action menu component', () => {
  it('show correct action menu', async () => {
    const props = {
      data: {
        id: "6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3"
      },
      userType: "admin"
    }

    const mocks = [
      {
        request: {
          query: DeleteBusiness,
          variables: { id: props.data.id },
        },
        result: { data: { businessDelete: { businessDelete: true } } },
      },
    ];
    const handleClose = jest.fn();
    const handleEdit = jest.fn();
    const refetch = jest.fn();
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <BusinessActionMenu
            data={props.data}
            anchorEl={document.createElement("button")}
            handleClose={handleClose}
            authState={authState}
            refetch={refetch}
            open
            handleEditClick={handleEdit}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('menu.delete')).toBeInTheDocument()
    expect(container.queryByText('menu.view_details')).toBeInTheDocument()
    // after clicking deleting menu
    fireEvent.click(container.queryByTestId('delete_button'))
    // check the appearance of delete modal
    expect(container.queryByText('dialogs.dialog_action')).toBeInTheDocument()

    // find delete button and click
    fireEvent.click(container.queryByTestId('confirm_action'))
    // after calling the mutation we close the modal and refetch remaining businesses
    await waitFor(() => {
      expect(handleClose).toBeCalled()
      expect(refetch).toBeCalled()
    }, 10)

    expect(container.queryByText('menu.edit')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('edit_button'));
    await waitFor(() => {
      expect(handleEdit).toBeCalled();
    }, 10)
  })
})
