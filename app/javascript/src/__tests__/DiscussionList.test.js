import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DiscussionList from '../components/Discussion/DiscussionList'
import { BrowserRouter } from 'react-router-dom'

describe('Discussion List page', () => {
    it('renders no topics when none provided', () => {
        const container = render(<DiscussionList  data={[]} />)
        expect(container.queryByText('No Discussions Topics')).toBeInTheDocument()
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
        const container = render(
            <BrowserRouter>
                <DiscussionList data={data} />
            </BrowserRouter>
        )
        expect(container.queryByText('No Discussions Topics')).not.toBeInTheDocument()
        expect(container.queryAllByTestId('disc_title')).toHaveLength(2)
        expect(container.queryByText('John Mbuzi')).toBeInTheDocument()
        expect(container.queryByText('Second Title')).toBeInTheDocument()
        expect(container.queryByText('Jo Kos')).toBeInTheDocument()
    })
    
})
