import React from 'react'
import { render } from '@testing-library/react'
import Paginate from '../components/Paginate'
import '@testing-library/jest-dom/extend-expect'

describe('paginate component', () => {
  const props = {
    offSet: 20,
    count: 20,
    limit: 10,
    handlePageChange: jest.mock('')
  }
 
  it('should have correct buttons', () => {
     const { getByTestId } = render(<Paginate {...props} />)
    expect(getByTestId('prev-btn')).toBeInTheDocument()
    expect(getByTestId('next-btn')).toBeInTheDocument()
  })

  it('should have correct buttons names', () => {
    const newProps = {}
      const { getByTestId } = render(<Paginate {...newProps} />)
      expect(getByTestId('prev-btn').textContent).toContain('Previous')
      expect(getByTestId('next-btn').textContent).toContain('Next')
    })
})
