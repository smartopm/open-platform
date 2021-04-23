import React from 'react'
import { render, act, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom/extend-expect'
import EditModal from '../components/Label/EditModal'
import { LabelEdit } from '../graphql/mutations'
import { Spinner } from '../shared/Loading';

describe('Comment Edit Field Component', () => {
  const mocks =
    {
      request: {
        query: LabelEdit,
        variables: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3', shortDesc: 'whgeukhw', description: 'This', color: '#fff'},
      },
      result: { data: { labelUpdate: { label: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4', __typename: 'typename' },  __typename: 'typename' } } },
    }
  const handleClose = jest.fn
  const open = true
  const data = {
    id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
    shortDesc: 'whgeukhw',
    color: "#fff",
    description: 'This'
  }

  it('render without error', async () => {
    const container = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <EditModal
            open={open}
            data={data}
            handleClose={handleClose}
            refetch={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    const title = container.queryByTestId('title')
    const description = container.queryByTestId('description')
    const color = container.queryByTestId('color')

    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(color).toBeInTheDocument()

    await act(async () => { 
      fireEvent.change(title, { target: { value: 'title' } })
      expect(title.value).toBe('title')

      fireEvent.change(description, { target: { value: 'description' } })
      expect(description.value).toBe('description')

      fireEvent.change(color, { target: { value: 'color' } })
      expect(color.value).toBe('color')

      const button = container.queryByTestId('button')
      fireEvent.click(button)
      const loader = render(<Spinner />);
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

      await waitFor(
        () => {
          expect(container.queryByText("Delete Campaign")).not.toBeInTheDocument()
        },
        { timeout: 300 }
      );
    })
  })

  it('render with error', async () => {
    const errorMocks =
    {
      request: {
        query: LabelEdit,
        variables: { id: '', shortDesc: '', description: '', color: ''},
      },
      result: { data: { labelUpdate: { label: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4', __typename: 'typename' },  __typename: 'typename' } } },
    }
    const container = render(
      <MockedProvider mocks={[errorMocks]}>
        <BrowserRouter>
          <EditModal
            open={open}
            data={data}
            handleClose={handleClose}
            refetch={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    const title = container.queryByTestId('title')
    const description = container.queryByTestId('description')
    const color = container.queryByTestId('color')

    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(color).toBeInTheDocument()

    await act(async () => { 
      fireEvent.change(title, { target: { value: 'title' } })
      expect(title.value).toBe('title')

      fireEvent.change(description, { target: { value: 'description' } })
      expect(description.value).toBe('description')

      fireEvent.change(color, { target: { value: 'color' } })
      expect(color.value).toBe('color')

      const button = container.queryByTestId('button')
      fireEvent.click(button)
      const loader = render(<Spinner />);
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

      await waitFor(
        () => {
          expect(container.queryByText("Delete Campaign")).not.toBeInTheDocument()
        },
        { timeout: 300 }
      );
    })
  })
})