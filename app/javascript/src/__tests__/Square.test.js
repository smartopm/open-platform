import React from 'react'
import { render } from '@testing-library/react'
import Square from '../components/Square'
import '@testing-library/jest-dom/extend-expect'

describe('Square component', function() {
  it("should render title and subtitle", function() {
    const props = {
      title: '5',
      subtitle: 'Total number of points',
      squareStyle: {}
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    const rendered = render(<Square {...props} />)

    expect(rendered.queryByText('5')).toBeInTheDocument()
    expect(rendered.queryByText('Total number of points')).toBeInTheDocument()
  })
})
