import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import DiscussionList from '../Components/DiscussionList'

describe('Discussion List page', () => {
  const fetchMock = jest.fn()
    it('renders no topics when none provided', () => {
        const container = render(
          <MockedProvider>
            <DiscussionList refetch={fetchMock} isAdmin data={[]} />
          </MockedProvider>
        )
        expect(container.queryByText('headers.no_discussions')).toBeInTheDocument()
    })
      
    it('renders list of topics when provided', () => {
        const data = [
            {
                title: 'First Title',
                user: { name: 'John Mbuzi' },
                description: 'Lets talk about this',
                id: '4567sd'
            },
            {
                title: 'Second Title',
                user: { name: 'Jo Kos' },
                description: 'Lets talk about that',
                id: '4567sd3874jssdf'
            }
        ]
        
        const isAdmin = true
        const container = render(
          <MockedProvider mocks={[]}>
            <BrowserRouter>
              <DiscussionList data={data} refetch={fetchMock} isAdmin={isAdmin} />
            </BrowserRouter>
          </MockedProvider>
        )
        expect(container.queryByText('headers.no_discussions')).not.toBeInTheDocument()
        expect(container.queryAllByTestId('disc_title')).toHaveLength(2)
        expect(container.queryByText('John Mbuzi')).toBeInTheDocument()
        expect(container.queryByText('Second Title')).toBeInTheDocument()
        expect(container.queryByText('Jo Kos')).toBeInTheDocument()
        expect(container.getAllByLabelText('delete')).toHaveLength(2)
        const deleteBtns = container.getAllByLabelText('delete')
        expect(deleteBtns[0]).not.toBeDisabled()
        expect(deleteBtns[1]).not.toBeDisabled()
        // can click
        fireEvent.click(deleteBtns[0])
    })
})
