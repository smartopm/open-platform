import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import {ShareButton} from '../components/ShareButton'


describe('share button', () => {
  it('should always render', () => {
    const container = render(<ShareButton />)
    expect(container.queryByText('common:misc.share')).toBeInTheDocument()
  })

  it('should render with the proper props', () => {
    const props = {
      url: 'https://dev.dgdp.site/news',
      doOnShare: jest.fn,
      communityName: 'Demo'
    }
    window.open = jest.fn()
    const container = render(<ShareButton {...props} />)
    const button = container.queryByText('common:misc.share')
    expect(button).toBeTruthy()

    fireEvent.click(button)
    const twitter = container.getByTestId("twitter")
    const email = container.getByTestId("email")
    expect(twitter).toBeInTheDocument()
    expect(container.getByTestId("linkedIn")).toBeInTheDocument()
    expect(container.getByTestId("whatsapp")).toBeInTheDocument()
    expect(email).toBeInTheDocument()
    expect(container.getByTestId("facebook")).toBeInTheDocument()

    fireEvent.click(twitter)
  })
})