import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import FormLinks from '../components/Forms/FormLinks'

describe('Shows the google form links', () => {
  it('It should render with no errors', () => {
    const container = render(<FormLinks />)

    expect(container.queryByTestId('forms-crf')).toBeInTheDocument()
    expect(container.queryByTestId('forms-building-permit')).toBeInTheDocument()
    expect(
      container.queryByTestId('forms-link-building-permit')
    ).toBeInTheDocument()
  })

  it('It should render containers with no errors', () => {
    const container = render(<FormLinks />)
    expect(container.queryByTestId('forms-link-crf')).toBeInTheDocument()
    expect(container.queryByTestId('forms-link-crf-icon')).toBeInTheDocument()
    expect(
      container.queryByTestId('forms-link-building-icon')
    ).toBeInTheDocument()
  })

  it('It should click link and open new tab', () => {
    window.open = jest.fn()
    const container = render(<FormLinks />)
    const buildPermit = container.queryByTestId('forms-link-building-permit')
    const clientForm = container.queryByTestId('forms-link-crf')
    fireEvent.click(buildPermit)
    expect(window.open).toBeCalledWith(
      'https://docs.google.com/forms/d/e/1FAIpQLSe6JmeKp9py650r7NQHFrNe--5vKhsXa9bFF9kmLAjbjYC_ag/viewform',
      '_blank'
    )
    fireEvent.click(clientForm)
    expect(window.open).toBeCalledWith(
      'https://docs.google.com/forms/d/e/1FAIpQLSe6JmeKp9py650r7NQHFrNe--5vKhsXa9bFF9kmLAjbjYC_ag/viewform',
      '_blank'
    )
  })
})
