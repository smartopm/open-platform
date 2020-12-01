import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Tag from '../components/NewsPage/Tag'

describe('Tags Component', () => {
  it('render without error', () => {
    const container = render(<Tag tag="Architecture"  />)
    expect(container.queryByText('Architecture')).toBeInTheDocument()
  })
})