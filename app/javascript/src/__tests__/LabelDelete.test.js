import React from 'react'
import { render, fireEvent, act, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import LabelDelete from '../components/Label/LabelDelete'
import '@testing-library/jest-dom/extend-expect'
import { DeleteLabel } from '../graphql/mutations'
import { Spinner } from '../shared/Loading';

describe('Comment Delete Component', () => {
  const handleClose = jest.fn
  const open = true
  const data = {
    id: 'jwhekw',
    shortDesc: 'whgeukhw'
  }
  const mocks =
    {
      request: {
        query: DeleteLabel,
        variables: { id: 'jwhekw' },
      },
      result: { data: { labelDelete: { labelDelete: "hello", __typename: 'typename' } } },
    }

  it('render without error', async () => {
    const container = render(
      <MockedProvider mocks={[mocks]}>
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
    })
    const loader = render(<Spinner />);
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    await waitFor(
      () => {
        expect(container.queryByText("Are you sure you want to delete this label")).not.toBeInTheDocument()
      },
      { timeout: 500 }
    );
  })

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
      expect(container.queryByText("Are you sure you want to delete this label?")).toBeInTheDocument()
    })
  })
})
