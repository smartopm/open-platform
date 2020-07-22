import React from 'react'
import { UserPlotInfo } from '../components/UserPlotInfo'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
describe('User Plot Info Page', () => {
  const accounts = [
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

  it('Component should display all parcel numbers', () => {
    let numberOfPlots = accounts.reduce((sum, account) => {
      return account.landParcels.length + sum
    }, 0)
    const { getByTestId } = render(
      <MockedProvider  mock={[]} >
      <BrowserRouter>
        <UserPlotInfo accounts={accounts} />
      </BrowserRouter>
      </MockedProvider>
    )
    const ol = getByTestId('parcel_list')
    expect(ol.children.length).toBe(numberOfPlots)
  })

  it('should include this type of a plot', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <UserPlotInfo accounts={accounts} />
      </BrowserRouter>
    )
    expect(getByTestId('parcel_list').textContent).toContain('Basic-1')
  })

  it('should show no plot when plots are empty', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <UserPlotInfo accounts={[]} />
      </BrowserRouter>
    )
    expect(getByTestId('no_plot').textContent).toContain(
      'No plots information available'
    )
  })

  it('should include support team link', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <UserPlotInfo accounts={accounts} />
      </BrowserRouter>
    )
    expect(getByTestId('support_link').textContent).toContain('Support Team')
  })

  afterEach(cleanup)
})
