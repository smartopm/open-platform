import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { PostItemGrid } from '../Components/NewsFeed'

describe('Details page for news post content', () => {
  const response = [
    {
      title: 'Test title',
      featured_image: 'https://placeholder.com',
      ID: 23
    },
    {
      title: 'Test Another title',
      featured_image: 'https://placeholder.com/2342',
      ID: 24
    }
  ]

  it('should include the post details', () => {
    const container = render(<PostItemGrid data={response} />)
    expect(container.queryByText('Test title')).toBeInTheDocument()
    expect(container.queryByTestId('recent_news')).toBeInTheDocument()
    expect(container.queryByText('Test Another title')).toBeInTheDocument()
    expect(container.queryAllByTestId('tile_image')[0]).toHaveAttribute('src', 'https://placeholder.com')
    expect(container.queryAllByTestId('tile_image')[1]).toHaveAttribute('src', 'https://placeholder.com/2342')
  })
    
  it('should not display anything when no data is available', () => {
    const container = render(<PostItemGrid data={[]} />)
    expect(container.queryByText('Test title')).not.toBeInTheDocument()
    expect(container.queryByText('Test Another title')).not.toBeInTheDocument()
  })
})
