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

  const { getByTestId } = render(<Paginate {...props} />)

  it('should have correct buttons', () => {
    expect(getByTestId('prev-btn')).toBeInTheDocument()
    expect(getByTestId('next-btn')).toBeInTheDocument()
    expect(getByTestId('prev-btn').textContent).toContain('Previous')
      expect(getByTestId('next-btn').textContent).toContain('Next')
  })
})
