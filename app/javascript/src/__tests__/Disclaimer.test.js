import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Disclaimer from '../components/Disclaimer'


describe('Disclaimer component', () => {
  it("should render 'Disclaimer' and body text", () => {
    const disclaimerBody = 'Here is the disclaimer body'
    const rendered = render(<Disclaimer body={disclaimerBody} />)
    const renderedClick = rendered.queryByText('A note about your activity')

    fireEvent.click(renderedClick)

    expect(renderedClick).toBeInTheDocument()
    expect(rendered.queryByText(disclaimerBody)).toBeInTheDocument()
  })
})
