/* eslint-disable */
import React from 'react';
import Support from '../components/SupportCard'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'

describe("Support card loads component", () => {


  it('should render support card', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Support />
      </BrowserRouter>
    )
    expect(getByText('support@doublegdp.com')).toBeInTheDocument()
    expect(getByText('+260 976 261199')).toBeInTheDocument()
  })
  it('should render support chart', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Support />
      </BrowserRouter>
    )
    expect(getByText('Support Chat')).toBeInTheDocument()
  })
  
  it('should include client request form', () => {
    const container = render(
      <BrowserRouter>
        <Support />
      </BrowserRouter>
    ) 
    expect(container.queryByText('Client Request Form')).toBeInTheDocument()
  });
  it('should should include support chat', () => {
    const container = render(
      <BrowserRouter>
        <Support />
      </BrowserRouter>
    ) 
    expect(container.queryByText('Support Chat')).toBeInTheDocument()
  });
  it('should have a pay with mobile money button', () => {
    const container = render(
      <BrowserRouter>
        <Support />
      </BrowserRouter>
    ) 
    expect(container.queryByText('Pay With Mobile Money')).toBeInTheDocument()
    expect(container.queryByText('Pay With Mobile Money')).not.toBeDisabled()
  });

})



