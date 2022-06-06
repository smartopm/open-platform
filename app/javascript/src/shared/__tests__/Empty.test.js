import React from 'react';
import { render } from '@testing-library/react'

import EmptyCard from "../EmptyCard";


describe('Empty Card component', () => {
  it('should render correctly', () => {
      const container = render(<EmptyCard title="title" subtitle='subtitle' />)
      expect(container.queryByText('title')).toBeInTheDocument()
      expect(container.queryByText('subtitle')).toBeInTheDocument()
  })
})

