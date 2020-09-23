import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MemoryRouter } from 'react-router'
import WelcomePage from '../components/AuthScreens/WelcomePage'

describe('component that centers divs', () => {
  const Welcome = () => (
    <MemoryRouter>
      <WelcomePage />
    </MemoryRouter>
  )
  let container

  beforeEach(() => {
    container = render(<Welcome />)
  })

  it('should include proper text', () => {
    expect(container.queryByText('Here i am')).toBeNull()
    expect(container.queryByText('Here i am')).not.toBeInTheDocument()
    expect(container.queryByTestId('contact').textContent).toContain('+260 966 194383')
    expect(container.queryByTestId('contact-email').textContent).toContain('hello@thebe-im.com')
  })
  it('should have action button texts', () => {
    expect(container.queryByText('Schedule a call')).toBeInTheDocument()
    expect(container.queryByText('Book a tour')).toBeInTheDocument()
    expect(container.queryByText('Become a client')).toBeInTheDocument()
  })

  it('should have main centered text', () => {
    expect(container.queryByTestId('maintext-centered').textContent).toContain(
      'Its not just a house'
    )
  })
  it('should have location text', () => {
    expect(container.queryByTestId('locationtext').textContent).toContain(
      '11 Nalikwanda Road'
    )
  })
  it('should have main text', () => {
    expect(container.queryByTestId('maintext').textContent).toContain(
      'Nkwashi is a new town that is being developed 36 kilometres east of the City of Lusaka'
    )
  })
  it('should have 3 main buttons', () => {
    expect(container.container.getElementsByTagName('button')).toHaveLength(6)
  })
  it('should have an image with a proper url', () => {
    expect(container.container.getElementsByTagName('img')[1]).toHaveAttribute(
      'src',
      'https://nkwashi.com/wp-content/uploads/2017/02/home-hero.jpg'
    )
  })
  it('The first image should have a proper alternative text ', () => {
    // we could get the path but don't have to
    expect(container.container.getElementsByTagName('img')[0]).toHaveAttribute(
      'alt',
      'Nkwashi logo with title'
    )
  })
  it('should have a main nkwashi logo ', () => {
    expect(container.queryByTestId('nkwashi_logo')).toHaveAttribute(
      'alt',
      'community logo'
    )
  })
  it('should have a footer thebe logo ', () => {
    expect(container.queryByTestId('thebe_logo')).toHaveAttribute(
      'alt',
      'thebe logo'
    )
  })
  it('should have copyright text ', () => {
    expect(container.queryByTestId('copyright_text').textContent).toContain(
      '©2017. Thebe Investment Management Limited. All Rights Reserved'
    )
  })
  it('should have social links ', () => {
    expect(container.queryByTestId('ld_follow')).toHaveAttribute(
      'href',
      'https://www.linkedin.com/company/10478892'
    )
    expect(container.queryByTestId('fb_like')).toHaveAttribute(
      'href',
      'https://www.facebook.com/nkwashi.soar/'
    )
  })
})
