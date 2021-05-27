import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import LabelActionMenu from '../../components/Label/LabelActionMenu'
import { DeleteBusiness } from '../../modules/Business/graphql/business_mutations'

describe('Label action menu component', () => {
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
    const refetch = jest.fn();
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LabelActionMenu
            data={props.data}
            anchorEl={null}
            handleClose={handleClose}
            userType={props.userType}
            refetch={refetch}
            open
          />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('menu.delete')).toBeInTheDocument()
    expect(container.queryByText('menu.merge')).toBeInTheDocument()
    expect(container.queryByText('menu.edit')).toBeInTheDocument()

    fireEvent.click(container.queryByText('menu.delete'))
    fireEvent.click(container.queryByTestId('cancel'))
    expect(container.queryByText('label.delete_dialog_title')).toBeInTheDocument()

    fireEvent.click(container.queryByText('menu.merge'))
    expect(container.queryByText('label.merge_dialog_title')).toBeInTheDocument()
    fireEvent.click(container.queryByTestId('dialog_cancel'))
    expect(container.queryByTestId('dialog_cancel')).toBeInTheDocument()
    fireEvent.click(container.queryByText('menu.edit'))
    fireEvent.click(container.queryByTestId('cancel_button'))
    expect(container.queryByTestId('cancel_button')).toBeInTheDocument()
  })
})
