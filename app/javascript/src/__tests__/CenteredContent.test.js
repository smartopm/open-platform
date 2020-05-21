import React from 'react'
import CenteredContent from '../components/CenteredContent'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('component that centers divs', () => {
  it('should not render with wrong props', () => {
    const props = {
      title: 'Here i am '
    }
    const container = render(<CenteredContent {...props} />)
    expect(container.queryByText('Here i am')).toBeNull()
    expect(container.queryByText('Here i am')).not.toBeInTheDocument()
  })

  it('should render with the proper props', () => {
    const otherProps = {
      children: <p>I am a paragraph</p>
    }
    const container = render(<CenteredContent {...otherProps} />)
      expect(container.queryByText('I am a paragraph')).not.toBeNull()
      expect(container.queryByText('I am a paragraph')).toBeInTheDocument()
  })
    
  it('should render with the proper props', () => {
    const container = render(<CenteredContent><p>I am another paragraph</p></CenteredContent>)
      expect(container.queryByText('I am another paragraph')).not.toBeNull()
      expect(container.queryByText('I am another paragraph')).toBeInTheDocument()
      expect(container.queryAllByText('I am another paragraph')).toHaveLength(1)
  })
})
