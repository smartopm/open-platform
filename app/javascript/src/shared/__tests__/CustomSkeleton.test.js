import React from 'react';
import { render } from '@testing-library/react'

import CustomSkeleton from "../CustomSkeleton";


describe('CustomSkeleton component', () => {
  it('should render correctly', () => {
      const container = render(<CustomSkeleton variant="rectangular" width='100%' height='110px' />)
      expect(container.queryByTestId('skeleton')).toBeInTheDocument();
  })
})

