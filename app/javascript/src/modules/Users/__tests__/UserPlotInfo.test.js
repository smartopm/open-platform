import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { cleanup, render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import UserPlotInfo from '../Components/UserPlotInfo'

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
    userName:'some name',
    userId: 'bwekwjkewj',
    userType: 'admin',
    permissions: [
        {
          module: 'land_parcel',
          permissions: [
            'can_create_land_parcel'
          ]
        }
    ]
  }

  const nonAdminMock = {
    userName:'some name',
    userId: 'bwekwjkewj',
    userType: 'client',
    permissions: [
        { 
          module: 'land_parcel',
          permissions: []
        }
    ]
  }

  it('should include this type of a plot', () => {
    const container = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserPlotInfo 
              account={account}
              userId={userMock.userId}
              userName={userMock.userName} 
              currentUser={userMock}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('Standard434')).toBeInTheDocument()
    expect(container.queryAllByTestId('plot')[0]).toBeInTheDocument()
    fireEvent.click(container.queryAllByTestId('plot')[0])
  })

  it('should contain a map display', () => {
    const container = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserPlotInfo 
              account={account}
              userId={userMock.userId}
              userName={userMock.userName}
              currentUser={userMock}
            />
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
            <UserPlotInfo 
              account={[]}
              userId={userMock.userId}
              userName={userMock.userName}
              currentUser={userMock}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('common:misc.no_plot')).toBeInTheDocument()

    expect(container.queryByTestId('add-plot')).toBeInTheDocument()
    fireEvent.click(container.queryByTestId('add-plot'))
  })

  it('should include support team link', () => {
    const { getByTestId } = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserPlotInfo 
              account={account}
              userId={userMock.userId}
              userName={userMock.userName}
              currentUser={userMock}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(getByTestId('support_link').textContent).toContain('common:misc.support_team')
  })

  it('should not display the new property button when current user is not an admin', () => {
    const container = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserPlotInfo 
              account={account}
              userId={userMock.userId}
              userName={userMock.userName}
              currentUser={nonAdminMock}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('add-plot')).toBeNull();
  });

  afterEach(cleanup)
})
