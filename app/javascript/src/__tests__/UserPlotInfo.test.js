import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import UserPlotInfo from '../components/UserPlotInfo'
import '@testing-library/jest-dom/extend-expect'

describe('User Plot Info Page', () => {
  const account = [
    {
      id: '2dc81-48ab-9afc',
      updatedAt: '2020-05-15T17:09:37Z',
      landParcels: [
        {
          id: '6f1f-4200-8cqa',
          parcelNumber: 'Standard434'
        },
        {
          id: '6f1f-4200-8cea',
          parcelNumber: 'Basic-1'
        }
      ]
    },
    {
      id: '2d81-48ab-9p8c',
      updatedAt: '2020-05-20T17:09:37Z',
      landParcels: [
        {
          id: '6f1f-4200-8jfa',
          parcelNumber: 'Basic-1'
        }
      ]
    }
  ]

  const userId = 'bwekwjkewj'
  
  it('should include this type of a plot', () => {
    const container = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <UserPlotInfo account={account} userId={userId} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('Standard434')).toBeInTheDocument()
  })

  it('should show no plot when plots are empty', () => {
    const container = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <UserPlotInfo account={[]} userId={userId} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('No plots information available')).toBeInTheDocument()
  })

  it('should include support team link', () => {
    const { getByTestId } = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <UserPlotInfo account={account} userId={userId} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(getByTestId('support_link').textContent).toContain('Support Team')
  })

  afterEach(cleanup)
})
