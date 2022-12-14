import React from 'react'
import { fireEvent, render, } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import Discuss from '../Components/Discuss'
import { DiscussionMutation } from '../../../graphql/mutations'

describe('Discuss component', () => {
  it('renders Discuss component correctly', async () => {
    const mocks = [
      {
        request: {
          query: DiscussionMutation,
          variables: { title: '', description: '' },
        },
        result: { data: { discussionCreate: { discussion: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4' } } } },
      },
    ];
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <Discuss
            update={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    const title = container.queryByTestId('title')
    const description = container.queryByTestId('description')
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()

    fireEvent.change(title, { target: { value: 'title' } })
    expect(title.value).toBe('title')

    fireEvent.change(description, { target: { value: 'description' } })
    expect(description.value).toBe('description')
  })

  it('renders Discuss component incorrectly', async () => {
    const discussionMock = [
      {
        request: {
          query: DiscussionMutation,
          variables: { title: 'title', description: 'description' },
        },
        result: { data: { discussionCreate: { discussion: { id: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4' } } } },
      },
    ];
    const container = render(
      <MockedProvider mocks={discussionMock} addTypename={false}>
        <BrowserRouter>
          <Discuss
            update={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    )
    const title = container.queryByTestId('title')
    const description = container.queryByTestId('description')
    expect(title).toBeInTheDocument()
    expect(description).toBeInTheDocument()

    fireEvent.change(title, { target: { value: 'title' } })
    expect(title.value).toBe('title')

    fireEvent.change(description, { target: { value: 'description' } })
    expect(description.value).toBe('description')
    })
})
