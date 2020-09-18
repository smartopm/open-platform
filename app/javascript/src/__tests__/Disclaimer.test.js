import React from 'react'
import { render } from '@testing-library/react'
import Disclaimer from '../components/Disclaimer'
import '@testing-library/jest-dom/extend-expect'

describe('Disclaimer component', function() {
  it("should render 'Disclaimer' and body text", function() {
    const disclaimerBody = 'Here is the disclaimer body'
    const rendered = render(<Disclaimer body={disclaimerBody} />)

    expect(rendered.queryByText('Disclaimer')).toBeInTheDocument()
    expect(rendered.queryByText(disclaimerBody)).toBeInTheDocument()
  })
})
