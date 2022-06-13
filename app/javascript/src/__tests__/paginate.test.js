/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import Paginate from '../components/Paginate'


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
      expect(getByTestId('prev-btn').textContent).toContain('misc.previous')
      expect(getByTestId('next-btn').textContent).toContain('misc.next')
  })

  it('previous button should be disabled when offset is less than limit', () => {
    const prevProps = {
      offSet: 0,
      count: 20,
      limit: 10,
      handlePageChange: jest.mock('')
    }
    const { getByTestId } = render(<Paginate {...prevProps} />)
    const btn = getByTestId('prev-btn')
    expect(btn).toBeDisabled()
  })
    it('next button should be disabled when count is less than limit', () => {
      const prevProps = {
        offSet: 0,
        count: 5,
        limit: 10,
        active: 'true',
        handlePageChange: jest.mock('')
      }
      const { getByTestId } = render(<Paginate {...prevProps} />)
      const btn = getByTestId('next-btn')
      expect(btn).toBeDisabled()
    })
  
  it('next button should be not disabled when count is more than limit', () => {
      const prevProps = {
        offSet: 0,
        count: 15,
        limit: 10,
        handlePageChange: jest.fn()
      }
      const { getByTestId } = render(<Paginate {...prevProps} />)
      const btn = getByTestId('next-btn')
      expect(btn).not.toBeDisabled()
    })
})
