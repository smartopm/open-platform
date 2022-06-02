import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import LabelDelete from '../Components/LabelDelete'

import { DeleteLabel } from '../../../graphql/mutations'

describe('Label Delete Component', () => {
  const handleClose = jest.fn
  const open = true
  const data = {
    id: 'jwhekw',
    shortDesc: 'whgeukhw'
  }

  it('render with error', async () => {
    const newMocks =
    {
      request: {
        query: DeleteLabel,
        variables: { id: 'jwhekwuielkrjlfk' },
      },
      result: { data: { labelDelete: { labelDelete: "hello", __typename: 'typename' },  __typename: 'typename' } },
    }
    const container = render(
      <MockedProvider mocks={[newMocks]}>
        <BrowserRouter>
          <LabelDelete
            data={data}
            open={open}
            handleClose={handleClose}
            refetch={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    await act(async () => {
      const button = container.queryByTestId('button')
      fireEvent.click(button)
      expect(container.queryByText('label.delete_dialog_title')).toBeInTheDocument()
      expect(container.queryByText('label.delete_warning_text')).toBeInTheDocument()
      expect(container.queryByText('common:form_actions.save_changes')).toBeInTheDocument()
      expect(container.queryByText('common:form_actions.cancel')).toBeInTheDocument()
    })
  })
})
