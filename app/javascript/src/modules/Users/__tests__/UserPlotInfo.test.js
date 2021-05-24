import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import UserPlotInfo from '../Components/UserPlotInfo'
import '@testing-library/jest-dom/extend-expect'
import MockedThemeProvider from '../../__mocks__/mock_theme'

describe('User Plot Info Page', () => {
  const account = [
    {
      id: '2dc81-48ab-9afc',
      updatedAt: '2020-05-15T17:09:37Z',
      landParcels: [
        {
          id: '6f1f-4200-8cqa',
          parcelNumber: 'Standard434',
          updatedAt: '2020-05-10T17:09:37Z',
        },
        {
          id: '6f1f-4200-8cea',
          parcelNumber: 'Basic-1',
          updatedAt: '2020-05-11T17:09:37Z',
        }
      ]
    },
    {
      id: '2d81-48ab-9p8c',
      updatedAt: '2020-05-20T17:09:37Z',
      landParcels: [
        {
          id: '6f1f-4200-8jfa',
          parcelNumber: 'Basic-1',
          updatedAt: '2020-05-12T17:09:37Z',
        }
      ]
    }
  ]

  const userMock = {
    userType:'admin',
    userId: 'bwekwjkewj'
  }

  it('should include this type of a plot', () => {
    const container = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserPlotInfo account={account} userId={userMock.userId} userType={userMock.userType} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('Standard434')).toBeInTheDocument()
  })

  it('should contain a map display', () => {
    const container = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserPlotInfo account={account} userId={userMock.userId} userType={userMock.userType} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByTestId('leaflet-map-container')).toBeTruthy()
  })

  it('should show no plot when plots are empty', () => {
    const container = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserPlotInfo account={[]} userId={userMock.userId} userType={userMock.userType} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('common:misc.no_plot')).toBeInTheDocument()
  })

  it('should include support team link', () => {
    const { getByTestId } = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserPlotInfo account={account} userId={userMock.userId} userType={userMock.userType} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(getByTestId('support_link').textContent).toContain('common:misc.support_team')
  })

  afterEach(cleanup)
})
