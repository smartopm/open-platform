import React from 'react'
import { render } from '@testing-library/react'
import UserPoints from '../components/UserPoints'
import '@testing-library/jest-dom/extend-expect'

describe('UserPoints component', function() {
  it("should render necessary activity points", function() {
    const userPoints = {
      total: 36,
      articleRead: 2,
      articleShared: 20,
      comment: 1,
      login: 3,
      referral: 10
    }
    const rendered = render(<UserPoints userPoints={userPoints} />)

    expect(rendered.queryByText('36')).toBeInTheDocument()
    expect(rendered.queryByText('Total number of points')).toBeInTheDocument()
    expect(rendered.queryByText('2')).toBeInTheDocument()
    expect(rendered.queryByText('Points for articles read')).toBeInTheDocument()
    expect(rendered.queryByText('20')).toBeInTheDocument()
    expect(rendered.queryByText('Points for articles shared')).toBeInTheDocument()
    expect(rendered.queryByText('1')).toBeInTheDocument()
    expect(rendered.queryByText('Point for comments made')).toBeInTheDocument()
    expect(rendered.queryByText('3')).toBeInTheDocument()
    expect(rendered.queryByText('Points for logging in')).toBeInTheDocument()
    expect(rendered.queryByText('10')).toBeInTheDocument()
    expect(rendered.queryByText('Points for referrals')).toBeInTheDocument()
  })
})
