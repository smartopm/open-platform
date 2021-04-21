import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import EmptyCard from '../../shared/EmptyCard';


describe('Empty Card component', () => {
  it('should render correctly', () => {
      const container = render(<EmptyCard title="title" subtitle='subtitle' />)
      expect(container.queryByText('title')).toBeInTheDocument()
      expect(container.queryByText('subtitle')).toBeInTheDocument()
  })
})

