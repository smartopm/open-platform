import React from 'react'
import { render } from '@testing-library/react'
import CenteredContent from '../shared/CenteredContent'


describe('component that centers divs', () => {

  it('should render with the proper props', () => {
    const container = render(<CenteredContent><p>I am a paragraph</p></CenteredContent>)
      expect(container.queryByText('I am a paragraph')).not.toBeNull()
      expect(container.queryByText('I am a paragraph')).toBeInTheDocument()
      expect(container.queryAllByText('I am a paragraph')).toHaveLength(1)
  })
})
